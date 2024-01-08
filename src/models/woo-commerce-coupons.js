import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  ewards_cart_id: { type: String, required: true },
  woo_coupon_code: { type: String, required: true },
  ewards_coupon_code: { type: String },
  ewards_points: { type: Number },
});

const couponModel = mongoose.model("Coupon", couponSchema);

export default couponModel;
