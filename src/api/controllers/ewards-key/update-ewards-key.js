import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { id: ewardsKeyId } = req.params;
  const { merchantId, wooCommerceId } = req;
  const { customer_key, x_api_key, notes } = req.body

  let ewardsKey = await EwardsKey.findOne({ _id: ewardsKeyId }).catch(
    (err) => {
      if (err.message.indexOf("Cast to ObjectId failed") !== -1)
        return res.status(404).json({
          resultMessage: { en: getText("en", "00023") },
          resultCode: "00023",
        });

      return res.status(500).json({
        resultMessage: { en: getText("en", "00000") },
        resultCode: "00000",
      });
    }
  );

  try {
    ewardsKey.ewards_merchant_id = merchantId;
    ewardsKey.woo_commerce_id = wooCommerceId;
    ewardsKey.customer_key = customer_key;
    ewardsKey.x_api_key = x_api_key;
    if (notes) ewardsKey.notes = notes;

    await ewardsKey.save();
    logger('00022', ewardsKey._id, getText('en', '00022'), 'Info', req, "EwardsKey");
    return res.status(200).json({
      resultMessage: { en: getText('en', '00022') },
      resultCode: '00022',
      ewards_key: ewardsKey
    });
  } catch (err) {
    logger('00097', '', getText('en', '00097'), 'Error', req, "EwardsKey");
    return res.status(500).json(errorHelper('00097', req, err.message));
  }
};
