import { WooCommerce,EwardsMerchant } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  let body = req.body;
  
  const woo_commerce = await WooCommerce.findOne({ store_url: body.woo_commerce.store_url })
    .catch((err) => {
      return res.status(500).json(errorHelper('00041', req, err.message));
  });



  const exists = await EwardsMerchant.exists({ merchant_id: body.merchant_id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00005', req, err.message));
  });

  // if (!exists) return res.status(404).json(errorHelper('00011', req));



  const woo_commerce_exists = await WooCommerce.exists({ store_url: body.woo_commerce.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00005', req, err.message));
  });

  if (!woo_commerce_exists) return res.status(404).json(errorHelper('00011', req));

  if (woo_commerce_exists && exists ) {
      if (woo_commerce.is_installed == false) {
        logger('00012', woo_commerce._id, getText('en', '00012'), 'Info', req, "WooCommerce");
        return res.status(200).json({
          resultMessage: { en: getText('en', '00012') },
          resultCode: '00012',
          woo_commerce
        });
      } else {
        logger('00013', woo_commerce._id, getText('en', '00013'), 'Info', req, "WooCommerce");
        return res.status(200).json({
          resultMessage: { en: getText('en', '00013') },
          resultCode: '00013',
          woo_commerce
        });
      }
  } else if(!exists){
    // logger('00016', woo_commerce._id, getText('en', '00016'), 'Info', req, "WooCommerce");
        return res.status(409).json({
          resultMessage: { en: getText('en', '00016') },
          resultCode: '00016'
      });
  }
};
