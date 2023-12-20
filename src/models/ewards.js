import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const EwardsMerchantSchema = Schema({
    merchant_id: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  });

const EwardsMerchant = model('EwardsMerchant', EwardsMerchantSchema);

export default EwardsMerchant;