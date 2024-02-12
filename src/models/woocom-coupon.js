import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CouponSchema = new Schema({
  ewards_cart_id: { type: Schema.Types.ObjectId, ref: 'EwardsCart' },
  woo_coupon_code: { type: String, required: true },
  ewards_coupon_code: { type: String },
  ewards_points: { type: Number },
  token_valid: { type: Date },
  use_limit: { type: Number, default: 1 },
  actual_used: { type: Number, default: 0 },
  name: { type: String },
  location: { type: String },
  valid_on: { type: String },
  timing: { type: String },
  valid_till: { type: Date },
  terms: { type: String },
});

const Coupon = model("Coupon", CouponSchema);

export default Coupon;
