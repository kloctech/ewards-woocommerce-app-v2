import { WooCommerce, EwardsMerchant } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  const store_url = req.query.store_url;

  const wooCommerce = await WooCommerce.findOne({ store_url }).catch(err => {
    return res.status(500).json(errorHelper('00018', req, err.message));
  })

  if (!wooCommerce) return res.status(404).json(errorHelper('00018', req))

  if (wooCommerce) {
    await EwardsMerchant.deleteOne({ _id: wooCommerce.ewards_merchant_id }).catch(err => {
      logger('00102', '', getText('en', '00102'), 'Error', req);
      return res.status(500).json(errorHelper('00102', req, err.message));
    })

    await WooCommerce.deleteOne({ _id: wooCommerce._id }).catch(err => {
      logger('00099', '', getText('en', '00099'), 'Error', req);
      return res.status(500).json(errorHelper('00099', req, err.message));
    })
  }

  logger('00100', wooCommerce._id, getText('en', '00100'), 'Info', req, 'WooCommerce');
  return res.status(200).json({
    resultMessage: { en: getText('en', '00100') },
    resultCode: '00100'
  });
}