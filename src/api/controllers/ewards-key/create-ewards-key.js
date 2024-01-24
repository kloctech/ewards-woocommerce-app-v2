import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { merchantId, wooCommerceId } = req;

  let ewards_key = new EwardsKey(req.body)
  ewards_key.ewards_merchant_id = merchantId
  ewards_key.woo_commerce_id = wooCommerceId

  try {
    ewards_key = await ewards_key.save();
    logger('00021', ewards_key._id, getText('en', '00021'), 'Info', req, 'EwardsKey');
    return res.status(200).json({
      resultMessage: { en: getText('en', '00021') },
      resultCode: '00021',
      ewards_key
    });
  } catch (err) {
    logger('00096', '', getText('en', '00096'), 'Error', req, 'EwardsKey');
    return res.status(500).json({
      resultMessage: { en: getText('en', '00096') },
      resultCode: '00096'
    });
  }
};


