import axios from "axios";
import { pointRedeemRequest } from "../../../config/index.js";
export default class RedeemPointService {
    constructor(points,customer,billAmount,cartToken,countryCode) {
        this.points = points
        this.customer = customer
        this.billAmount = billAmount
        this.cartToken = cartToken
        this.x_api_key = "HfktWlQUDB3fjqOPxzJEF7WRtdieeN8Q8c8RcCSR"
        this.merchant_id = "15441607" 
        this.customer_key = "12345"
        this.country_code = countryCode
    }

    async execute(){
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.x_api_key,
        }
        const body =  {
            "customer_key": this.customer_key,
            "merchant_id": this.merchant_id,
            "points": this.points,
            "mobile": this.customer.mobile,
            "country_code": this.customer.country_code,
            "bill_amount": this.billAmount,
            "cart_token": this.cartToken,
        }

        const response = await axios.post(pointRedeemRequest,body,{headers})
        return response.data
        // const couponCode = await new CreateWoocommerceCode(consumerKey, consumerSecret, url, minimumAmount, email, usageLimit, usageLimitPerUser, billAmount, couponDetails, points, mobileNumber, cartId).execute()
    }

    async #body(){
        const body =  {
            "customer_key": this.customer_key,
            "merchant_id": this.merchant_id,
            "mobile": this.customer.mobile,
            "country_code": this.customer.country_code,
            "cart_token": this.cartToken,
            "bill_amount": this.billAmount,
            "points": this.points
        }

    return body
    }

}