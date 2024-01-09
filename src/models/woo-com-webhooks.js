import mongoose from "mongoose";
const { Schema, model } = mongoose;

const WooComWebhookSchema = new Schema({
  delivery_url: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, required: true }, // Default value for status
  name: { type: String },
  woo_commerce_id: { type: String, required: true, unique: true }, // Unique ID for WooCommerce
});

const WooComWebhook = model("WooCommerceWebhook", WooComWebhookSchema);

export default WooComWebhook;
