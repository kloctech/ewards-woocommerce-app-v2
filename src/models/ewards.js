import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const EwardsMerchantSchema = new Schema({
  merchant_id: { type: String, required: true, unique: true },
  ewards_keys: [{ type: Schema.Types.ObjectId, ref: 'EwardsKey' }],
},
  { timestamps: true });

const EwardsMerchant = model('EwardsMerchant', EwardsMerchantSchema);
export default EwardsMerchant;