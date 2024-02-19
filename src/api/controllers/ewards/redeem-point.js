import { errorHelper, logger, getText } from '../../../utils/index.js';
import { WooCommerce, Cart, Customer } from "../../../models/index.js";
import crypto from "crypto";
import { RedeemPointService, CaptureWoocommerceCode } from '../../services/ewards/index.js';
import { CreateCouponService } from '../../services/woo-commerce/index.js';

export default async (req, res) => {
  let body = req.body;
  if (Number(body.bill_amount) < Number(body.minimum_bill)) return res.status(404).json(errorHelper('00122', req));

  const wooCommerce = await WooCommerce.findOne({ store_url: body.store_url })
    .populate({
      path: 'ewards_key_id',
      model: 'EwardsKey',
      populate: {
        path: 'ewards_merchant_id',
        model: 'EwardsMerchant',
        select: 'merchant_id',
      }
    })
    .populate({
      path: 'customers',
      model: 'WooCommerceCustomer',
      match: { mobile: body.mobile_number },
    }).exec()
    .catch((err) => {
      return res.status(500).json(errorHelper("00000", req, err.message));
    });

  if (!wooCommerce) return res.status(404).json(errorHelper('00018', req));

  const ewardsKey = wooCommerce.ewards_key_id;
  const merchantId = ewardsKey.ewards_merchant_id.merchant_id;
  if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));
  if (!merchantId) return res.status(400).json(errorHelper("00110", req));

  let customer = wooCommerce.customers[0];
  if (!customer) {
    return res.status(400).json({
      resultMessage: { en: getText("en", "00107") },
      resultCode: "00107"
    });
  }

  const cartToken = crypto.randomBytes(16).toString('hex')

  const points = await new RedeemPointService(ewardsKey, merchantId, body, cartToken).execute()

  if (points.status_code === 400) {
    console.log('Ewards : Points could not be redeemed')
    return res.status(400).json({
      resultMessage: { en: points.response.message }
    });
  }
  console.log("Ewards: Redeem points api for " + points.response.points_monetary_value + " points value");

  let cart = new Cart({ cart_token: cartToken, customer_id: customer._id })
  await cart.save().catch(err => {
    logger("00120", "", getText("en", "00120"), "Error", req, "Cart");
    return res.status(500).json(errorHelper("00120", req, err.message));
  })

  customer = await Customer.findOne({ _id: customer._id });
  customer.carts.push(cart._id);
  customer.save();
  logger("00119", cart._id, getText("en", "00119"), "Info", req, "Cart");

  console.log("Cart Token Created " + cart.cart_token);

  const value = points.response.points_monetary_value;


  const couponCode = await new CreateCouponService(wooCommerce, body.minimum_bill, customer.email, body.bill_amount, null, String(value), body.mobile_number, cart).execute()

  if (!couponCode) {
    return res.status(400).json({
      resultMessage: { en: getText("en", "00117") },
      resultCode: "00117"
    });
  }

  console.log("Woocommerce: Coupon Created " + couponCode);

  const captureCode = await new CaptureWoocommerceCode(ewardsKey, merchantId, points.response.points_value, null, customer, cartToken, couponCode).execute()

  if (captureCode.status_code === 400) {
    console.log('Ewards : Coupon code could not be captured by ewards')
    return res.status(400).json({
      resultMessage: { en: captureCode.response.message }
    });
  }

  console.log("Ewards: woocommerce Coupon captured by ewards " + couponCode);

  return res.status(200).json({ woocommerce_coupon: couponCode });
}