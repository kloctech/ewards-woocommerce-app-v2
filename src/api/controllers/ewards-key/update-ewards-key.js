import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { id: ewardsKeyId } = req.params;
  const { merchant, wooCommerce } = req;
  const { customer_key, x_api_key, notes, newMerchantId } = req.body;

  try {
    let ewardsKey = await EwardsKey.findOne({ _id: ewardsKeyId });

    if (!ewardsKey) {
      return res.status(404).json({
        resultMessage: { en: getText("en", "00023") },
        resultCode: "00023",
      });
    }

    ewardsKey.ewards_merchant_id = merchant._id;
    ewardsKey.woo_commerce_id = wooCommerce._id;
    ewardsKey.customer_key = customer_key;
    ewardsKey.x_api_key = x_api_key;
    if (notes) ewardsKey.notes = notes;

    await ewardsKey.save();
    logger('00022', ewardsKey._id, getText('en', '00022'), 'Info', req, "EwardsKey");

    merchant.merchant_id = newMerchantId;
    await merchant.save();
    logger('00132', merchant._id, getText('en', '00132'), 'Info', req, "EwardsMerchant");

    return res.status(200).json({
      resultMessage: { en: getText('en', '00022') },
      resultCode: '00022',
      ewards_key: ewardsKey,
      merchant
    });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const firstErrorField = Object.keys(err.errors)[0];
      const errorDetail = err.errors[firstErrorField];

      // Accessing `kind` and `path`
      const kind = errorDetail.kind;
      const path = errorDetail.path;

      const errorMessage = kind === 'unique' && `${path} must be unique, entered value has already been used in different store.`;

      logger('00097', '', errorMessage, 'Error', req, "EwardsKey");
      return res.status(500).json({
        resultMessage: { en: errorMessage },
        resultCode: '00097'
      });
    } else {
      logger('00097', '', getText('en', '00097'), 'Error', req, "EwardsKey");
      return res.status(500).json(errorHelper('00097', req, err.message));
    }
  }
};
