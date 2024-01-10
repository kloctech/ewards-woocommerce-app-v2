import mongoose from "mongoose";
const { Schema, model } = mongoose;

const WooComWebhookSchema = new Schema({
  delivery_url: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, required: true },
  name: { type: String, required: true },
  woo_commerce_id: { type: Schema.Types.ObjectId, required: true, ref: 'woo-commerce' },
});

const WooComWebhook = model("WooCommerceWebhook", WooComWebhookSchema);

export default WooComWebhook;
