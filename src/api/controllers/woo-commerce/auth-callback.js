import { WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';
import { RegisterWebhookService } from '../../services/woo-commerce/index.js'

export default async (req, res) => {
  let body = req.body;
  const storeUrl = req.body.user_id;

  const wooCommerce = await WooCommerce.findOneAndUpdate({ store_url: storeUrl }, body, { returnDocument: 'after' })
    .catch((err) => {
      return res.status(500).json(errorHelper('00041', req, err.message));
    });

  if (wooCommerce) {
    const webhookService = new RegisterWebhookService(wooCommerce);
    webhookService.execute();
  }

  if (!wooCommerce) return res.status(409).json(errorHelper('00004', req));

  logger('00006', wooCommerce._id, getText('en', '00006'), 'Info', req, "WooCommerce");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00006') },
    resultCode: '00006', woo_commerce: wooCommerce
  });
}
