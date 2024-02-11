import { errorHelper, logger, getText } from '../../../utils/index.js';
import { EwardsKey, WooCommerce,Customer, Cart } from "../../../models/index.js";
// import { pointRedeemRequest } from '../../../config/index.js';
import { RedeemPointService } from '../../services/ewards/index.js'
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

  let points = await new RedeemPointService(wooCommerce,req.body.points,customer,req.body.bill_amount,cartToken).execute()



    // let cart = await new Cart({
    //   cart_token: cartToken,
    //   customer_id: customer._id
    // }).save()

    let coupon = await new CreateCouponService().execute()



  return res.status(200).json({
    resultMessage: { en: getText('en', '00089'), tr: getText('tr', '00089') },
    resultCode: '00089',
    points: points
  });
}