import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EwardsCartSchema = new Schema({
  cart_token: { type: String, required: true },
  customer_id: { type: Schema.Types.ObjectId, ref: 'WooCommerceCustomer' },
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  coupon_id: { type: Schema.Types.ObjectId, ref: 'Coupon' },
}, { timestamps: true });

const EwardsCart = model("EwardsCart", EwardsCartSchema);

export default EwardsCart;
