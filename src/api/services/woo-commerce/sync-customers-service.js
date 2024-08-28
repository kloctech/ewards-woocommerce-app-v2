import pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = pkg.default;
import axios from "axios";
import { Customer } from "../../../models/index.js";
import { logger, getText } from "../../../utils/index.js";

export default class SyncCustomersService {
  constructor(wooCommerce) {
    this.wooCommerce = wooCommerce;
    this.url = wooCommerce.store_url;
    this.consumerKey = wooCommerce.consumer_key;
    this.consumerSecret = wooCommerce.consumer_secret;
    this.WooCommerce = new WooCommerceRestApi({
      url: this.url,
      consumerKey: this.consumerKey,
      consumerSecret: this.consumerSecret,
      version: "wc/v3",
      queryStringAuth: true,
    });
    this.wooCommerceId = wooCommerce._id;
  }

  async execute() {
    let customerResponse = await this.WooCommerce.get("customers", { per_page: 100, page: 1, role: "customer" }).catch((error) => {
      console.log(error.message);
    });
    let subscriberResponse = await this.WooCommerce.get("customers", { per_page: 100, page: 1, role: "subscriber" }).catch((error) => {
      console.log(error.message);
    });

    await this.#createCustomers([...customerResponse.data, ...subscriberResponse.data]);
    logger("00027", this.wooCommerceId, getText("en", "00027"), "Info", "", "Customer");

    let nextUrlCustomers = await this.#getNextPageUrl(customerResponse.headers.link, "customer");
    let nextUrlSubscribers = await this.#getNextPageUrl(subscriberResponse.headers.link, "subscriber");
    await this.#fetchCustomers(nextUrlCustomers);
    await this.#fetchCustomers(nextUrlSubscribers);
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
      for (const customer of insertCustomer) {
        this.wooCommerce.customers.push(customer._id)
      }
      await this.wooCommerce.save()
    } catch (err) {
      console.log(err);
      logger("00026", this.wooCommerceId, getText("en", "00026"), "Error", "", "Customer");
    }
    return insertCustomer;
  }

  #processCustomersData(customers) {
    const customersData = [];
    customers.map((customer) => {
      customersData.push({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        mobile: customer.billing.phone.slice(-10),
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
