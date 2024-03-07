import axios from "axios";
import { billCancelRequest } from "../../../config/index.js";

export default class BillCancelService {
  constructor(order, ewardsKey, merchantId) {
    this.order = order;
    this.ewardsKey = ewardsKey;
    this.merchantId = merchantId;
  }

  async execute() {

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.ewardsKey.x_api_key,
    }
    const requestObj = {
      merchant_id: this.merchantId,
      customer_key: this.ewardsKey.customer_key,
      order_id: `${this.order.id}`,
      mobile: this.order.billing.phone,
      country_code: "91",
      purchase_date: this.order.date_created.replace(/T/g, ' ')
    }

    const response = await axios.post(billCancelRequest, requestObj, { headers })
      .catch((err) => {
        console.log('Ewards : ', err.response.data)
      })

    return response?.data ?? null;
  }
}