import wc from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = wc.default;
import { Production_URL } from '../../../config/index.js'
import { WoocomWebhooks, WooCommerce } from '../../../models/index.js'

const webHooksArr = [
  {
    name: 'Customer created',
    topic: 'customer.created',
    deliveryUrl: `${Production_URL}/api/customer_create`
  },
  {
    name: 'Customer updated',
    topic: 'customer.updated',
    deliveryUrl: `${Production_URL}/api/customer_update`
  },
  {
    name: 'Coupon created',
    topic: 'coupon.created',
    deliveryUrl: `${Production_URL}/api/coupon_create`
  },
  {
    name: 'Coupon updated',
    topic: 'coupon.updated',
    deliveryUrl: `${Production_URL}/api/coupon_update`
  },
  {
    name: 'Order created',
    topic: 'order.created',
    deliveryUrl: `${Production_URL}/api/order_create`
  },
  {
    name: 'Order updated',
    topic: 'order.updated',
    deliveryUrl: `${Production_URL}/api/order_update`
  }

]

export default class RegisterWebhookService {
  constructor(wooCommerce) {
    this.store_url = wooCommerce.store_url;
    this.consumer_key = wooCommerce.consumer_key;
    this.consumer_secret = wooCommerce.consumer_secret;
    this.woo_commerce_id = wooCommerce._id
  }

  async execute() {
    const apiWooComm = new WooCommerceRestApi({
      url: this.store_url,
      consumerKey: this.consumer_key,
      consumerSecret: this.consumer_secret,
      version: 'wc/v3'
    });

    for (const hook of webHooksArr) {
      try {
        const data = {
          name: hook.name,
          topic: hook.topic,
          delivery_url: hook.deliveryUrl
        };

        const response = await apiWooComm.post('webhooks', data);
        if (response.status === 201) {
          console.log('Webhook registered:', response.data.name);
          const { name, topic, status, delivery_url } = response.data
          let webHookData = {
            name, topic, status, delivery_url, woo_commerce_id: this.woo_commerce_id
          }
          const webHook = await WoocomWebhooks.create(webHookData)
          console.log(webHook)
        }
      } catch (error) {
        console.log(`Failed to register webhook ${hook.name}:`, error.response ? error.response.data : error.message);
      }
    }
  }
}
