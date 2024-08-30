import { WooCommerce, EwardsMerchant } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  let body = req.body;

  const wooCommerce = await WooCommerce.findOne({ store_url: body.woo_commerce.store_url }).select("-customers")
    .catch((err) => {
      return res.status(500).json(errorHelper('00041', req, err.message));
    });

  const exists = await EwardsMerchant.exists({ merchant_id: body.merchant_id })
    .catch((err) => {
      return res.status(500).json(errorHelper('00005', req, err.message));
    });

  // if (!exists) return res.status(404).json(errorHelper('00011', req));

  const wooCommerceExists = await WooCommerce.exists({ store_url: body.woo_commerce.store_url })
    .catch((err) => {
      return res.status(500).json(errorHelper('00005', req, err.message));
    });

  if (!wooCommerceExists) return res.status(404).json(errorHelper('00011', req));

  if (wooCommerceExists && exists) {
    if (wooCommerce.is_installed == false) {
      logger('00012', wooCommerce._id, getText('en', '00012'), 'Info', req, "WooCommerce");
      return res.status(200).json({
        resultMessage: { en: getText('en', '00012') },
        resultCode: '00012',
        woo_commerce: wooCommerce
      });
    } else {
      logger('00013', wooCommerce._id, getText('en', '00013'), 'Info', req, "WooCommerce");
      return res.status(200).json({
        resultMessage: { en: getText('en', '00013') },
        resultCode: '00013',
        woo_commerce: wooCommerce
      });
    }
  } else if (!exists) {
    // logger('00016', woo_commerce._id, getText('en', '00016'), 'Info', req, "WooCommerce");
    return res.status(409).json({
      resultMessage: { en: getText('en', '00016') },
      resultCode: '00016'
    });
  }
};
