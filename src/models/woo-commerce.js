import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const WooCommerceSchema = new Schema({
  consumer_key: {
      type: String
  },
  store_url: {
      type: String,
      required: true,
      unique: true
  },
  key_id: {
      type: Number
  },
  consumer_secret: {
      type: String
  },
  key_permissions: {
      type: String
  },
  ewards_merchant_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'EwardsMerchant'
  },
  is_installed:{
    type: Boolean,
    default: false
  },
  customers: [{ type: Schema.Types.ObjectId, ref: 'WooCommerceCustomer' }],
},{timestamps: true});

const WooCommerce = model('WooCommerce', WooCommerceSchema);

export default WooCommerce;