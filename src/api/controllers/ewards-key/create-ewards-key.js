import { EwardsKey ,EwardsMerchant,WooCommerce} from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {

  let merchant = await EwardsMerchant.exists({ merchant_id: req.body.merchant_id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });

  let woo_commerce = await WooCommerce.exists({ store_url: req.body.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });



  let ewardsKey = new EwardsKey(req.body)
    ewardsKey.ewards_merchant_id = merchant._id
    ewardsKey.woo_commerce_id = woo_commerce._id
    ewardsKey = await ewardsKey.save().catch((err) => {
      return res.status(500).json(errorHelper('00014', req, err.message));
    });
  logger('00014', ewardsKey._id, getText('en', '00014'), 'Info', req,"ewardsMerchantId");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00014') },
    resultCode: '00014', ewardsKey
  });
}