import axios from "axios";
import { couponRedeemRequest } from "../../../config/index.js";
import { errorHelper } from "../../../utils/index.js";

export default class RedeemCouponService {
  constructor(ewardsKey, merchantId, body, cartToken) {
    this.couponCode = body.coupon_details.token_code;
    this.mobile = body.mobile_number;
    this.billAmount = body.bill_amount;
    this.cartToken = cartToken;
    this.x_api_key = ewardsKey.x_api_key;
    this.merchantId = merchantId;
    this.customerKey = ewardsKey.customer_key;
    this.countryCode = body.country_code;
  }

  async execute() {
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.x_api_key,
    }
    const body = {
      "customer_key": this.customerKey,
      "merchant_id": this.merchantId,
      "coupon_code": this.couponCode,
      "mobile": this.mobile,
      "country_code": this.countryCode,
      "bill_amount": this.billAmount,
      "cart_token": this.cartToken,
    }

    const response = await axios.post(couponRedeemRequest, body, { headers })
    return response.data
  }
  async #redeemCoupon() {
    const couponResponse = await axios.post(couponRedeemRequest, this.requestBody, { headers: this.reqHeaders }).catch((err) => {
      console.log('Ewards :' + err.message)
      return errorHelper("00121", null, err.message);
    });
    return couponResponse.data;
  }

}