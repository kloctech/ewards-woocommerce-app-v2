import mongoose from "mongoose";
const { Schema, model } = mongoose;

const WooComCustomerSchema = new Schema(
  {
    first_name: { type: String, },
    last_name: { type: String, },
    mobile: { type: String },
    email: { type: String, required: true },
    country_code: { type: String },
    woo_customer_id: { type: Number, required: true },
    woo_commerce_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "WooCommerce",
    },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    carts: [{ type: Schema.Types.ObjectId, ref: "EwardsCart" }],
  },
  { timestamps: true }
);

// Creating a compound unique index
WooComCustomerSchema.index(
  { woo_customer_id: 1, woo_commerce_id: 1 },
  { unique: true }
);

const WooComCustomer = model("WooCommerceCustomer", WooComCustomerSchema);
export default WooComCustomer;
