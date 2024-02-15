import { WooCommerce, Cart } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { randomBytes } from 'crypto';
import { RedeemCouponService } from "../../services/ewards/index.js"
import { CreateCouponService } from "../../services/woo-commerce/index.js"


export default async (req, res) => {
  let body = req.body;

  const wooCommerce = await WooCommerce.findOne({ store_url: body.store_url })
    .populate({
      path: 'ewards_key_id',
      model: 'EwardsKey',
      populate: {
        path: 'ewards_merchant_id',
        model: 'EwardsMerchant',
      }
    })
    .populate({
      path: 'customers',
      model: 'WooCommerceCustomer',
      match: { mobile: body.mobile_number },
      select: 'woo_commerce_id'
    }).exec()
    .catch((err) => {
      return res.status(500).json(errorHelper("00000", req, err.message));
    });

  if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

  const ewardsKey = wooCommerce.ewards_key_id;
  const merchant = ewardsKey.ewards_merchant_id;
  if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));
  if (!merchant) return res.status(400).json(errorHelper("00110", req));


  const customers = wooCommerce.customers;
  const customer = customers.find((customer) =>
    customer.woo_commerce_id.valueOf() === wooCommerce._id.valueOf()
  );
  if (!customer) {
    return res.status(400).json({
      resultMessage: { en: getText("en", "00107") },
      resultCode: "00107"
    });
  }

  const cartToken = randomBytes(16).toString('hex');
  let cartObj = new Cart({ cart_token: cartToken, customer_id: customer._id })
  await cartObj.save().catch(err => {
    logger("00120", "", getText("en", "00105"), "Error", req, "Cart");
    return res.status(500).json(errorHelper("00120", req, err.message));
  })
  logger("00119", cartObj._id, getText("en", "00105"), "Info", req, "Cart");

  const redeemCoupon = new RedeemCouponService(ewardsKey, merchant.merchant_id, body, cartToken)
  const couponResponse = await redeemCoupon.execute()

  const createCoupon = new CreateCouponService(wooCommerce, body, cartObj, couponResponse.response.discount_value)
  const couponData = await createCoupon.execute()

  res.json(couponData)
}