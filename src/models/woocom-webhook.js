import mongoose from "mongoose";
const { Schema, model } = mongoose;

const wooComWebhookSchema = new Schema({
  delivery_url: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  woo_commerce_id: { type: Schema.Types.ObjectId, required: true, ref: 'WooCommerce' },
});

const WoocomWebhook = model("WooCommerceWebhook", wooComWebhookSchema);
export default WoocomWebhook;
