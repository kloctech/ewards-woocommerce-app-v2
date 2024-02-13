import { errorHelper, logger, getText } from '../../../utils/index.js';
import { EwardsKey, WooCommerce,Customer, Cart } from "../../../models/index.js";
// import { pointRedeemRequest } from '../../../config/index.js';
import { RedeemPointService } from '../../services/ewards/index.js';
import {CreateCouponService} from '../../services/woo-commerce/index.js';
// import { custom } from 'joi';

//require('crypto').randomBytes(16).toString('hex');

// Generate cart token and save against customer and save 
// Create Point and Coupon request in woocommerce and save details of coupon
//

export default async (req, res) => {

  let wooCommerce = await WooCommerce.findOne({ store_url: req.body.store_url })
  .populate('customers')
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });

  if (!wooCommerce) return res.status(404).json(errorHelper('00089', req));

  let customer = wooCommerce.customers.find(customer => customer.mobile === req.body.mobile);

  let cartToken = "TESTTOEKN";

  // let points = await new RedeemPointService(req.body.points,customer,req.body.bill_amount,cartToken,req.body.country_code).execute()

  let points = {response:
    {points_value: '10', points_monetary_value: 5, redeem_id: false}}


  let value = points.response.points_monetary_value
    // let cart = await new Cart({
    //   cart_token: cartToken,
    //   customer_id: customer._id
    // }).save()

    let coupon =  new CreateCouponService(wooCommerce.consumer_key, wooCommerce.consumer_secret, wooCommerce.store_url, 1, customer.email, 1 , 1 , req.body.bill_amount, 1, value , req.body.mobile,"65c5069c232e8af9b7efa8cd")
    await coupon.execute()

    // const member = new CreateCouponService(consumerKey, consumerSecret, storeUrl, body.minimum_amount, body.email_restrictions, body.usage_limit, body.usage_limit_per_user, body.bill_amount, body.coupon_details, body.points, body.mobile_number, body.cart_id);

    // const coupon = await member.execute();

  return res.status(200).json({
    resultMessage: { en: getText('en', '00089'), tr: getText('tr', '00089') },
    resultCode: '00089',
    points: coupon
  });
}