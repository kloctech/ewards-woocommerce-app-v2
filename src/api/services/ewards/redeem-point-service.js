import axios from "axios";
import { pointRedeemRequest } from "../../../config/index.js";
import { errorHelper } from '../../../utils/index.js';

export default class RedeemPointService {
    constructor(ewardsKey, merchantId, body, cartToken) {
        this.points = body.points;
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
            "points": this.points,
            "mobile": this.mobile,
            "country_code": this.countryCode,
            "bill_amount": this.billAmount,
            "cart_token": this.cartToken,
        }

        const response = await axios.post(pointRedeemRequest, body, { headers }).catch((err) => {
            console.log('Ewards :' + err.message)
            return errorHelper("00123", null, err.message);
        });
        return response.data
    }

}