import axios from "axios";
import { billSettlementRequest } from "../../../config/index.js";

export default class BillSettlementService {
  constructor(order, ewardsKey, merchantId, cartToken) {
    this.order = order;
    this.ewardsKey = ewardsKey;
    this.merchantId = merchantId;
    this.cartToken = cartToken;
  }

  async execute() {

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.ewardsKey.x_api_key,
    }
    const orderObj = {
      merchant_id: this.merchantId,
      customer_key: this.ewardsKey.customer_key,
      customer: {
        name: `${this.order.billing.first_name} ${this.order.billing.last_name}`,
        mobile: this.order.billing.phone,
        country_code: "91",
        address: `${this.order.billing.address_1} ${this.order.billing.address_2}`,
        email: this.order.billing.email,
        gender: '',
        city: this.order.billing.city,
        dob: '',
        doa: '',
        state: this.order.billing.state,
        tag: ''
      }, transaction: {
        id: this.order.id,
        number: this.order.number,
        type: this.order.payment_method,
        payment_type: this.order.payment_method_title,
        gross_amount: `${Number(this.order.discount_total) + Number(this.order.total)}`,
        net_amount: this.order.total,
        amount: `${Number(this.order.discount_total) + Number(this.order.total) + Number(this.order.total_tax)}`,
        discount: this.order.discount_total,
        order_time: this.order.date_created,
        online_bill_source: '',
        items: this.order.line_items.map(item => {
          return {
            name: item.name,
            id: item.id,
            rate: item.price,
            quantity: item.quantity,
            subtotal: item.subtotal,
            category: item.variation_id,
            bar_code: '',
            hsn_code: '',
            cost_price: item.price,
            marked_price: item.price,
            payment_mode: [],
            taxes: [{ name: item.tax_class, amount: item.total_tax }],
            charges: [],
            taxable_amount: true
          }
        }),
        taxes: [{ name: this.order.tax_lines[0]?.label, amount: this.order.total_tax }],
        charges: [{ name: 'Shipping charges', amount: this.order.shipping_total }],
        channel: [{ name: "web" }],
        server: [],
        redemption: {
          shopify_coupon_code: this.order.coupon_lines[0]?.code,
          cart_token: this.cartToken,
          checkout_token: this.order.cart_hash
        }
      }
    }

    const response = await axios.post(billSettlementRequest, orderObj, { headers }).catch(err => {
      console.log(err.response)
    })
    return response.data
  }
}