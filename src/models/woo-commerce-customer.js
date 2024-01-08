import mongoose from "mongoose";

const wooCommerceCustomer = new mongoose.Schema({
  last_name: { type: String, required: true },
  mobile: { type: String, required: true },
  first_name: { type: String, required: true },
  email: { type: String, required: true },
  country_code: { type: String },
  woo_customer_id: { type: String },
  woo_store_id: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
});

const wooCommerceCustomersModel = mongoose.model(
  "WooCommerceCustomers",
  wooCommerceCustomer
);

export default wooCommerceCustomersModel;
