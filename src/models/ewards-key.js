import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import uniqueValidator from "mongoose-unique-validator"

const EwardsKeySchema = new Schema({
  ewards_merchant_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'EwardsMerchant'
  },
  customer_key: {
      type: String,
      required: true,
      unique: true
  },
  x_api_key: {
      type: String,
      required: true,
      unique: true
  },
  woo_commerce_id: {
      type: Schema.Types.ObjectId,
      required: true, 
      ref: 'WooCommerce'
  },
  notes:{
      type: String
  }
}, {timestamps: true});

EwardsKeySchema.plugin(uniqueValidator)

const EwardsKey = model('EwardsKey', EwardsKeySchema);

export default EwardsKey;