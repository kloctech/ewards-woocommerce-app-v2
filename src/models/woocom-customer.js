import mongoose from "mongoose";
const { Schema, model } = mongoose;

const WooComCustomerSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  mobile: { type: String },
  email: { type: String, required: true },
  country_code: { type: String },
  woo_customer_id: { type: Number ,required: true},
  woo_commerce_id: { type: Schema.Types.ObjectId,
    required: true, 
    ref: 'WooCommerce' },
  address: { type: String },
  city: { type: String },
  state: { type: String },
});

const WooComCustomer = model("WooCommerceCustomer", WooComCustomerSchema);
export default WooComCustomer;
