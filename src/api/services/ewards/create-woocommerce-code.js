import axios from "axios";
// import { EwardsKey, WooCommerce, EwardsMerchant } from "../../../models/index.js";
import { createCreateWoocommerceCode } from "../../../config/index.js";

export default class CreateWoocommerceCode {
    constructor(wooCommerce,points_monetary_value,couponCode,customer,cartToken,wooCommerceCode) {
        this.WooCommerce = wooCommerce
        this.points = points_monetary_value
        this.customer = customer
        this.cartToken = cartToken
        this.couponCode = couponCode
        this.wooCommerceCode = wooCommerceCode
        this.x_api_key = "HfktWlQUDB3fjqOPxzJEF7WRtdieeN8Q8c8RcCSR"
        this.merchant_id = "15441607" 
        this.customer_key = "Shopify_test"
    }

    async execute(){
        const response = await axios.post(createCreateWoocommerceCode, this.#requestBody,{headers: this.#header});
    }

    async #requestBody(){
        return {
            "customer_key" : this.wooCommerce,
            "merchant_id" : "15441607",
            "shopify_code" : this.wooCommerceCode,
            "coupon_code" : this.couponCode,
            "points" : this.points,
            "mobile" : this.customer.mobile,
            "country_code" : this.customer.country_code,
            "cart_token" : this.cartToken
        }
    }

    async #header(){
        
       return {
            "Content-Type": "application/json",
            "x-api-key": this.x_api_key,
        }
        
    }

}