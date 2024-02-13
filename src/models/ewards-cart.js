import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EwardsCartSchema = new Schema({
  cart_token: { type: String, required: true },
  customer_id: { type: Schema.Types.ObjectId, ref: 'WooCommerceCustomer' },
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  coupon: { type: Schema.Types.ObjectId, ref: 'Coupon' },
});

const EwardsCart = model("EwardsCart", EwardsCartSchema);

export default EwardsCart;
