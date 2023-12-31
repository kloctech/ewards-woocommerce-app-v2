import mongoose from "mongoose";
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  woo_order_json: { type: Object }, // Storing as Object assuming it will hold JSON data
  woo_order_id: { type: String, required: true },
  gross_amount: { type: Number, required: true },
  net_amount: { type: Number, required: true },
  order_date_created: { type: Date, default: Date.now },
  total_amount: { type: Number, required: true },
  woo_comm_store_id: { type: String },
  discount_amount: { type: Number },
  payment_method_title: { type: String },
  ewards_card_id: { type: String },
  order_cancelled: { type: Boolean, default: false },
});

const Order = model("Order", OrderSchema);

export default Order;
