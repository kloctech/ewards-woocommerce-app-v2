import pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = pkg.default;
import { productionUrl } from '../../../config/index.js'
import { WoocomWebhook } from '../../../models/index.js'
import { logger, getText } from '../../../utils/index.js';

const webHooksArr = [
  {
    name: 'Customer created',
    topic: 'customer.created',
    deliveryUrl: `${productionUrl}/api/customer/create`
  },
  {
    name: 'Customer updated',
    topic: 'customer.updated',
    deliveryUrl: `${productionUrl}/api/customer/update`
  },
  {
    name: 'Coupon created',
    topic: 'coupon.created',
    deliveryUrl: `${productionUrl}/api/coupon/create`
  },
  {
    name: 'Coupon updated',
    topic: 'coupon.updated',
    deliveryUrl: `${productionUrl}/api/coupon/update`
  },
  {
    name: 'Order created',
    topic: 'order.created',
    deliveryUrl: `${productionUrl}/api/order/create`
  },
  {
    name: 'Order updated',
    topic: 'order.updated',
    deliveryUrl: `${productionUrl}/api/order/update`
  }

]

export default class RegisterWebhookService {
  constructor(wooCommerce) {
    this.store_url = wooCommerce.store_url;
    this.consumer_key = wooCommerce.consumer_key;
    this.consumer_secret = wooCommerce.consumer_secret;
    this.woo_commerce_id = wooCommerce._id;
    this.apiWooComm = new WooCommerceRestApi({
      url: this.store_url,
      consumerKey: this.consumer_key,
      consumerSecret: this.consumer_secret,
      version: "wc/v3",
    });
  }

  async execute() {
    for (const hook of webHooksArr) {
      await this._createWebhook(hook);
    }
  }

  // Function to create webhook in woocommerce
  async _createWebhook(hook) {
    const data = {
      name: hook.name,
      topic: hook.topic,
      delivery_url: hook.deliveryUrl,
    };
    const response = await this.apiWooComm.post("webhooks", data).catch((err) => {
      console.log(err);
    });

    if (response && response?.status === 201) {
      this._storeData(response.data);
    }
  }
  // Function to store webhook data in db
  async _storeData(hookData) {
    const { name, topic, status, delivery_url } = hookData;
    let webHookData = {
      name,
      topic,
      status,
      delivery_url,
      woo_commerce_id: this.woo_commerce_id,
    };
    const webHook = await WoocomWebhook.create(webHookData).catch((err) => {
      console.log(err);
      logger("00093", "", getText("en", "00093"), "Error", "", "WoocomWebhooks");
    });
    logger("00095", webHook._id, getText("en", "00095"), "Info", "", "WoocomWebhooks");
  }
}
