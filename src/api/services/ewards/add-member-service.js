import axios from "axios";
import { EwardsKey, WooCommerce, EwardsMerchant } from "../../../models/index.js";
import { ewardsAddMemberApiUrl } from "../../../config/index.js";

export default class AddMemberService {
  constructor(customer_data) {
    this.customer = {
      first_name: customer_data.first_name,
      last_name: customer_data.last_name || "",
      mobile: customer_data.mobile,
      email: customer_data.email,
      country_code: customer_data.country_code,
      // address:customer_data.address,
      // city:customer_data.city,
      // state: customer_data.state
    };
    this.woo_commerce_id = customer_data.woo_commerce_id;
  }

  async execute() {
    await this.#getEwardsMerchantId();
  }

  async #getEwardsMerchantId() {
    const wooCommerce = await WooCommerce.findOne({ _id: this.woo_commerce_id }).catch((err) => console.log(err));
    if (wooCommerce) {
      this.ewards_merchant_id = wooCommerce.ewards_merchant_id;
    }
    await this.#getMerchantId();
    await this.#getEwardsKey();
    await this.#addCustomerToEwards();
  }

  async #getMerchantId() {
    const ewardsMerchant = await EwardsMerchant.findOne({ _id: this.ewards_merchant_id }).catch((err) => console.log(err));
    if (ewardsMerchant) {
      this.merchant_id = ewardsMerchant.merchant_id;
    }
  }

  async #getEwardsKey() {
    const ewardsKey = await EwardsKey.findOne({ woo_commerce_id: this.woo_commerce_id }).catch((err) => console.log(err));

    if (ewardsKey) {
      this.customer_key = ewardsKey.customer_key;
      this.x_api_key = ewardsKey.x_api_key;
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
