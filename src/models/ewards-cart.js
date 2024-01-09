import mongoose from "mongoose";
const { Schema, model } = mongoose;

const EWardsCartSchema = new Schema({
  cart_token: { type: String, required: true },
  customer_id: { type: String, required: true },
});

const EWardsCart = model("EWardsCart", EWardsCartSchema);

export default EWardsCart;
