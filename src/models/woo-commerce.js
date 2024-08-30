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
    is_installed: {
        type: Boolean,
        default: false
    },
    ewards_key_id: { type: Schema.Types.ObjectId, ref: 'EwardsKey' },
    is_customers_synced: { type: Boolean, default: false },
    customers: [{ type: Schema.Types.ObjectId, ref: 'WooCommerceCustomer' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    webhooks: [{ type: Schema.Types.ObjectId, ref: 'WooCommerceWebhook' }]
}, { timestamps: true });

const WooCommerce = model('WooCommerce', WooCommerceSchema);

// Migration function
async function addIsCustomersSyncedField() {
    try {
        // Update only documents where the field does not exist
        const result = await WooCommerce.updateMany(
            { is_customers_synced: { $exists: false } },
            { $set: { is_customers_synced: true } }
        );

        // Check if any documents were modified
        if (result.modifiedCount > 0) {
            console.log(`Migration completed successfully. ${result.modifiedCount} documents were updated.`);
        }
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

// Run the migration
addIsCustomersSyncedField();

export default WooCommerce;