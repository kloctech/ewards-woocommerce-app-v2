import { WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  let body = req.body;
  const woo_commerce = await WooCommerce.findOne({ store_url: body.store_url })
    .catch((err) => {
      return res.status(500).json(errorHelper('00041', req, err.message));
  });

  const woo_commerce_exists = await WooCommerce.exists({ store_url: body.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00005', req, err.message));
  });

  if (!woo_commerce_exists) return res.status(404).json(errorHelper('00011', req));

  if (woo_commerce_exists) {
      if (woo_commerce.is_installed == false) {
        logger('00089', woo_commerce, getText('en', '00012'), 'Info', req);
        return res.status(200).json({
          resultMessage: { en: getText('en', '00012') },
          resultCode: '00012',
          woo_commerce
        });
      } else {
        logger('00089', woo_commerce, getText('en', '00013'), 'Info', req);
        return res.status(200).json({
          resultMessage: { en: getText('en', '00013') },
          resultCode: '00013',
          woo_commerce
        });
      }
  }
};
