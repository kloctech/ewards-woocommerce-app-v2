import axios from "axios";
import { EwardsKey, WooCommerce, EwardsMerchant } from "../../../models/index.js";
import { ewardsAddMemberApiUrl } from "../../../config/index.js";

export default class AddMemberService {
  constructor(customers_data) {
    this.customers_data = customers_data;
  }

  async execute() {
    if (this.customers_data.length > 0) {
      await this.#getWooCommerce(this.customers_data[0]?.woo_commerce_id);

      for (const customer of this.customers_data) {
        if (!customer.mobile) continue;
        this.customer = {
          first_name: customer.first_name,
          last_name: customer.last_name || "",
          mobile: customer.mobile,
          email: customer.email,
          country_code: customer.country_code,
          // address:customer.address,
          // city:customer.city,
          // state: customer.state
        };
        // this.woo_commerce_id = customer.woo_commerce_id;
        await this.#addCustomerToEwards();
      }
    }

  }

  async #getWooCommerce(wooCommerceId) {
    try {
      const wooCommerce = await WooCommerce.findOne({ _id: wooCommerceId })
      if (wooCommerce) {
        this.ewards_merchant_id = wooCommerce.ewards_merchant_id;
      }
      await this.#getMerchantId();
      await this.#getEwardsKey(wooCommerceId);
    } catch (error) {
      console.log(error.message)
    }
  }

  async #getMerchantId() {
    try {
      const ewardsMerchant = await EwardsMerchant.findOne({ _id: this.ewards_merchant_id });
      if (ewardsMerchant) {
        this.merchant_id = ewardsMerchant.merchant_id;
      }
    } catch (error) {
      console.log("Error while getting ewards merchant id : ", error.message);
    }

  }

  async #getEwardsKey(wooCommerceId) {
    try {
      const ewardsKey = await EwardsKey.findOne({ woo_commerce_id: wooCommerceId })
      if (ewardsKey) {
        this.customer_key = ewardsKey.customer_key;
        this.x_api_key = ewardsKey.x_api_key;
      }
    } catch (error) {
      console.log("Error while getting EwardsKeys : ", error.message);
    }

  }

  async #addCustomerToEwards() {
    try {
      const requestBody = {
        customer: this.customer,
        merchant_id: this.merchant_id,
        customer_key: this.customer_key,
      };
      const headers = {
        "Content-Type": "application/json",
        "x-api-key": this.x_api_key,
      };

      const { data: response } = await axios.post(ewardsAddMemberApiUrl, requestBody, { headers });
      console.log("Ewards member created : ", response);
    } catch (error) {
      console.log("Error while creating ewards member : ", error.message);
    }
  }
}
