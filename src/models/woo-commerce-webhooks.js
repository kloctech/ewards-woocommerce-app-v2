import mongoose from "mongoose";

const woocommerceWebhookSchema = new mongoose.Schema({
  delivery_url: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, required: true }, // Default value for status
  name: { type: String },
  woo_commerce_id: { type: String, required: true, unique: true }, // Unique ID for WooCommerce
});

const WoocommerceWebhook = mongoose.model(
  "WoocommerceWebhook",
  woocommerceWebhookSchema
);

export default WoocommerceWebhook;
