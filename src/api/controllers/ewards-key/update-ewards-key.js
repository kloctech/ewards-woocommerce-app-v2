import { EwardsKey,EwardsMerchant,WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';
import { validateEwardsKey } from '../../validators/ewards.key.validator.js';
export default async (req, res) => {
  const { error } = validateEwardsKey(req.body);

  if (error) {
    let code = '00025';
    if (error.details[0].message.includes('merchant_id'))
      code = '00038';
    else if (error.details[0].message.includes('store_url'))
      code = '00038';
    else if (error.details[0].message.includes('x_api_key'))
      code = '00038';
    else if (error.details[0].message.includes('customer_key'))
      code = '00038';
    return res.status(400).json(errorHelper(code, req, error.details[0].message));
  }

  const ewards_key =  await EwardsKey.findOne({ _id: req.params.id })
  .catch((err) => {
    if (err.message.indexOf('Cast to ObjectId failed') !== -1)
        return res.status(404).json({
          resultMessage: { en: getText('en', '00023') },
          resultCode: '00023'
        });

    return res.status(500).json({
      resultMessage: { en: getText('en', '00000') },
      resultCode: "Error while fetching the data on the database"
      } );
  });

  let merchant = await EwardsMerchant.exists({ merchant_id: req.body.merchant_id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });
  if (!merchant) return res.status(404).json(errorHelper('00017', req));

  let woo_commerce = await WooCommerce.exists({ store_url: req.body.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });
  if (!woo_commerce) return res.status(404).json(errorHelper('00018', req));

  if(req.body.customer_key)  ewards_key.customer_key = req.body.customer_key;
  if(req.body.x_api_key)  ewards_key.x_api_key = req.body.x_api_key;
  if(req.body.notes)  ewards_key.notes = req.body.notes;
  if(req.body.merchant_id)  ewards_key.ewards_merchant_id = merchant._id;
  if(req.body.store_url)  ewards_key.woo_commerce_id = woo_commerce._id;

  await ewards_key.save().catch((err) => {
    return res.status(500).json(errorHelper('00000', req, err.message));
  });

  logger('00022', ewards_key._id, getText('en', '00022'), 'Info',req, "EwardsKey");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00022') },
    resultCode: '00022',
    ewards_key
  });
}