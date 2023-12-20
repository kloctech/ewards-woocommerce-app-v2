import { WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  let body = req.body;
  const store_url = req.body.user_id;

  const woo_commerce = await WooCommerce.findOneAndUpdate({ store_url: store_url },body)
  .catch((err) => {
    return res.status(500).json(errorHelper('00041', req, err.message));
  });

  if (!woo_commerce) return res.status(409).json(errorHelper('00004', req));

  logger('00006', woo_commerce._id, getText('en', '00006'), 'Info', req,"WooCommerce");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00006') },
    resultCode: '00006', woo_commerce
  });
}
