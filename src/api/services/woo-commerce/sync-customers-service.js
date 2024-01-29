import pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = pkg.default;
import axios from "axios";
import { Customer } from "../../../models/index.js";
import { logger, getText } from "../../../utils/index.js";
import { AddMemberService } from "../ewards/index.js";

export default class SyncCustomersService {
  constructor(woo_commerce_id, url, consumerKey, consumerSecret) {
    this.url = url;
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.WooCommerce = new WooCommerceRestApi({
      url: this.url,
      consumerKey: this.consumerKey,
      consumerSecret: this.consumerSecret,
      version: "wc/v3",
      queryStringAuth: true,
    });
    this.wooCommerceId = woo_commerce_id;
  }

  async execute() {
    let response = await this.WooCommerce.get("customers?page=1&per_page=100").catch((error) => {
      console.log(error.response);
    });
    await this.#createCustomers(response.data);
    logger("00027", this.wooCommerceId, getText("en", "00027"), "Info", "", "Customer");
    let nextUrl = await this.#getNextPageUrl(response.headers.link);
    await this.#fetchCustomers(nextUrl);
  }

  async #fetchCustomers(nextPageUrl) {
    if (nextPageUrl) {
      let response = await axios.get(nextPageUrl).catch((err) => {
        console.log(err);
      });
      await this.#createCustomers(response.data);
      let nextUrl = await this.#getNextPageUrl(response.headers.link);
      await this.#fetchCustomers(nextUrl);
    } else {
      console.log("page ended");
    }
  }

  #getNextPageUrl(urlString) {
    let nextPage;
    try {
      if (urlString.search("next") >= 1 && urlString.search("prev") >= 1) {
        nextPage = urlString.split(", ")[1].replace("<", "").replace(">", "").split("; ")[0];
        return nextPage;
      } else if (urlString.search("next") >= 1) {
        nextPage = urlString.replace("<", "").replace(">", "").split("; ")[0];
      } else {
        nextPage = null;
      }
      return nextPage;
    } catch (error) {
      console.log(error);
    }
  }

  async #createCustomers(customers) {
    let customerData = this.#processCustomersData(customers);
    let insertCustomer;
    try {
      insertCustomer = await Customer.insertMany(customerData);
      await this.#createCustomerToEwards(customers);
    } catch (err) {
      console.log(err);
      logger("00026", this.wooCommerceId, getText("en", "00026"), "Info", "", "Customer");
    }
    return insertCustomer;
  }

  async #createCustomerToEwards(customers) {
    let customerData = this.#processCustomersData(customers);
    for (let customer of customerData) {
      if (customer.mobile) {
        const member = new AddMemberService(customer);
        await member.execute();
      }
    }
  }

  #processCustomersData(customers) {
    const customersData = [];
    customers.map((customer) => {
      customersData.push({
        first_name: customer.first_name,
        last_name: customer.last_name,
        mobile: customer.billing.phone,
        email: customer.email,
        woo_customer_id: customer.id,
        woo_commerce_id: this.wooCommerceId,
        address: `${customer.billing.address_1}-${customer.billing.address_2}`,
        city: customer.billing.city,
        state: customer.billing.state,
        country_code: "+91",
      });
    });
    return customersData;
  }
}
