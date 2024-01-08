import mongoose from "mongoose";

const eWardsCartSchema = new mongoose.Schema({
  cart_token: { type: String, required: true },
  customer_id: { type: String, required: true },
});

const eWardsCartModel = mongoose.model("EWardsCart", eWardsCartSchema);

export default eWardsCartModel;
