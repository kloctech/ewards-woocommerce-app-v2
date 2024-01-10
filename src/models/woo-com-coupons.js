import mongoose from "mongoose";
const { Schema, model } = mongoose;

const CouponSchema = new Schema({
  ewards_cart_id: { type: String, required: true },
  woo_coupon_code: { type: String, required: true },
  ewards_coupon_code: { type: String },
  ewards_points: { type: Number },
});

const Coupon = model("Coupon", CouponSchema);

export default Coupon;
