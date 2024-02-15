import axios from "axios";
import { createCreateWoocommerceCode } from "../../../config/index.js";

export default class CaptureWoocommerceCode {
    constructor(ewardsKey,merchantId,points,couponCode,customer,cartToken,wooCommerceCode) {
        this.points = points
        this.customer = customer
        this.cartToken = cartToken
        this.couponCode = couponCode
        this.wooCommerceCode = wooCommerceCode
        this.xApiKey = ewardsKey.x_api_key
        this.merchantId = merchantId
        this.customerKey = ewardsKey.customer_key
    }

    async execute(){
        const body = {
            "customer_key" : this.customerKey,
            "merchant_id" : this.merchantId,
            "shopify_code" : this.wooCommerceCode,
            "coupon_code" : this.couponCode,
            "points" : this.points,
            "mobile" : this.customer.mobile,
            "country_code" : this.customer.country_code,
            "cart_token" : this.cartToken
        }
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.xApiKey,
        }
        const response = await axios.post(createCreateWoocommerceCode, body,{headers}).catch((err) => {
            console.log("Ewards: "+err);
          });;
        return response.data
    }

}