import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const EwardsKeySchema = new Schema({
  ewards_merchant_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'EwardsMerchant'
  },
  customer_key: {
      type: String,
      unique: true
  },
  x_api_key: {
      type: String,
      required: true
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


const EwardsKey = model('EwardsKey', EwardsKeySchema);

export default EwardsKey;