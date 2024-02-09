import axios from "axios";
import { pointRedeemRequest } from "../../../config/index.js";
import { CreateWoocommerceCode } from "./index.js"

export default class RedeemPointService {
    constructor(points,customer,billAmount,cartToken) {
        this.points = points
        this.customer = customer
        this.billAmount = billAmount
        this.cartToken = cartToken
        this.x_api_key = "HfktWlQUDB3fjqOPxzJEF7WRtdieeN8Q8c8RcCSR"
        this.merchant_id = "15441607" 
        this.customer_key = "Shopify_test"
    }

    async execute(){
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.x_api_key,
        }
        const response = await axios.post(pointRedeemRequest,this.#body,{headers})
        console.log(response);
        const couponCode = await new CreateWoocommerceCode().execute()
    }

    async #body(){
        return {
            "customer_key": this.customer_key,
            "merchant_id": this.merchant_id,
            "mobile": this.customer.mobile,
            "country_code": this.customer.country_code,
            "cart_token": this.cartToken,
            "bill_amount": this.billAmount,
            "points": this.points
        }
    }

}