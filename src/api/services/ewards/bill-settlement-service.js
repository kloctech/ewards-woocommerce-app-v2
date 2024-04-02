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
    const orderObj = this.#getOrderData(this.order)

    const response = await axios.post(billSettlementRequest, orderObj, { headers }).catch(err => {
      console.log('Ewards : ', err.response.data)
    })
    return response?.data ?? null
  }

  #getOrderData(order) {
    return {
      merchant_id: this.merchantId,
      customer_key: this.ewardsKey.customer_key,
      customer: {
        name: `${this.order.billing.first_name} ${this.order.billing.last_name}`,
        mobile: this.order.billing.phone,
        country_code: "+91",
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
        number: Number(this.order.number),
        type: this.order.payment_method,
        payment_type: this.order.payment_method_title,
        gross_amount: `${(Number(this.order.total) + Number(this.order.discount_total) - Number(this.order.total_tax)).toFixed(2)}`,
        net_amount: `${(Number(this.order.total) - Number(this.order.total_tax)).toFixed(2)}`,
        discount: this.order.discount_total,
        amount: `${Number(this.order.total).toFixed(2)}`,
        order_time: this.order.date_created.replace(/T/g, ' '),
        online_bill_source: '',
        items: this.#getCartItems(order.line_items),
        taxes: this.order.tax_lines.map(tax => ({ name: tax.label, amount: tax.tax_total })),
        charges: [{ name: 'Shipping charges', amount: this.order.shipping_total }],
        channel: [{ name: "web" }],
        server: [],
        redemption: {
          shopify_coupon_code: this.order.coupon_lines[0]?.code || "",
          cart_token: this.cartToken || "",
          checkout_token: this.order.cart_hash
        }
      }
    }
  }
  #getCartItems(items) {
    return items.map(item => ({
      name: item.name,
      id: item.id,
      rate: `${item.price}`,
      quantity: item.quantity,
      subtotal: Number(item.subtotal),
      category: `${item.variation_id}`,
      bar_code: '',
      hsn_code: '',
      cost_price: `${item.price}`,
      marked_price: `${item.price}`,
      payment_mode: [],
      taxes: item.taxes.map((tax, index) => ({ name: this.order.tax_lines[index].label, amount: tax.total })),
      charges: [],
      taxable_amount: true
    }));
  }
}