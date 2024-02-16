import { EwardsKey } from "../../../models/index.js";
import { getText, logger } from "../../../utils/index.js";

export default async (req, res) => {
  const { merchant, wooCommerce } = req;

  let ewards_key = new EwardsKey(req.body)
  ewards_key.ewards_merchant_id = merchant._id
  ewards_key.woo_commerce_id = wooCommerce._id

  try {
    ewards_key = await ewards_key.save();
    wooCommerce.ewards_key_id = ewards_key._id;
    await wooCommerce.save();
    merchant.ewards_keys.push(ewards_key._id);
    await merchant.save();
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


