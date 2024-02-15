import { errorHelper, logger, getText } from '../../../utils/index.js';
import { WooCommerce,Cart } from "../../../models/index.js";
import crypto from "crypto";
import { RedeemPointService,CaptureWoocommerceCode } from '../../services/ewards/index.js';
import { CreateCouponService } from '../../services/woo-commerce/index.js';

export default async (req, res) => {

  const wooCommerce = await WooCommerce.findOne({ store_url: req.body.store_url })
  .populate('customers')
  .populate({
    path: 'ewards_key',
    populate: {
        path: 'ewards_merchant_id',
        model: 'EwardsMerchant',
        select: 'merchant_id'
    }})
  .catch((err) => {
    return res.status(500).json(errorHelper('00008', req, err.message));
  });

  if (!wooCommerce) return res.status(404).json(errorHelper('00018', req));

  const customer = wooCommerce.customers.find(customer => customer.mobile === req.body.mobile);

  const ewardsKey = wooCommerce.ewards_key
  const merchantId = ewardsKey.ewards_merchant_id.merchant_id

  const cartToken = crypto.randomBytes(16).toString('hex')

  const cartbody = {cart_token: cartToken,customer_id: customer.id}

  const cart = new Cart(cartbody)
  await cart.save().catch(err => {
    // logger("00120", "", getText("en", "00105"), "Error", req, "Cart");
    return res.status(500).json(errorHelper("00008", req, err.message));
  })

  console.log("Cart Token Created " + cart.cart_token);

  const points = await new RedeemPointService(req.body.points,customer,req.body.bill_amount,cartToken,req.body.country_code).execute()

  console.log("Ewards: Redeem points api for " + points.response.points_monetary_value +" points value");

  const value = points.response.points_monetary_value

  const couponCode = await new CreateCouponService(wooCommerce,req.body.minimum_bill,customer.email,req.body.bill_amount,null,String(value),req.body.mobile,cart._id).execute()

  console.log("Woocommerce: Coupon Created "+ couponCode);

  await new CaptureWoocommerceCode(ewardsKey,merchantId,points.response.points_value,null,customer,cartToken,couponCode).execute()

  console.log("Ewards: woocommerce Coupon captured by ewards "+couponCode);

  return res.status(200).json({woocommerce_coupon: couponCode});
}