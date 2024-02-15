import axios from "axios";
import { couponRedemptionApiUrl } from "../../../config/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";

export default class RedeemCouponService {
  constructor(ewardsKey, merchantId, body, cartToken) {
    this.reqHeaders = {
      "x-api-key": ewardsKey.x_api_key,
    };
    this.requestBody = {
      customer_key: ewardsKey.customer_key,
      merchant_id: merchantId,
      coupon_code: body.coupon_details.token_code,
      mobile: body.mobile_number,
      country_code: body.country_code,
      bill_amount: body.bill_amount,
      cart_token: cartToken
    }
  }

  async execute() {
    return this.#redeemCoupon()
  }
  async #redeemCoupon() {
    const couponResponse = await axios.post(couponRedemptionApiUrl, this.requestBody, { headers: this.reqHeaders }).catch((err) => {
      return errorHelper("00111", null, err.message);
    });
    return couponResponse.data;
  }

}