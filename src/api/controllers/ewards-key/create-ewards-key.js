import { EwardsKey ,EwardsMerchant,WooCommerce} from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';
import { validateEwardsKey } from '../../validators/ewards.key.validator.js';

export default async (req, res) => {
  let body = req.body
  const { error } = validateEwardsKey(body);

  if (error) {
    let code = '00027';
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


  let merchant = await EwardsMerchant.exists({ merchant_id: req.body.merchant_id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });

  let woo_commerce = await WooCommerce.exists({ store_url: req.body.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });

  if (!woo_commerce && !merchant) {
    return res.status(404).json({
      resultMessage: { en: getText('en', '00019') },
      resultCode: '00019'
    });
  } else if(!woo_commerce) {
    return res.status(404).json({
      resultMessage: { en: getText('en', '00018') },
      resultCode: '00018'
    });
  } else if(!merchant){
    return res.status(404).json({
      resultMessage: { en: getText('en', '00017') },
      resultCode: '00017'
    });
  }

  let ewards_key = new EwardsKey(req.body)
    ewards_key.ewards_merchant_id = merchant._id
    ewards_key.woo_commerce_id = woo_commerce._id
    ewards_key = await ewards_key.save()
    .catch((err) => {
      return res.status(500).json(err.errors);
    });
  logger('00021', ewards_key._id, getText('en', '00021'), 'Info', req,"EwardsKey");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00021') },
    resultCode: '00021', ewards_key
  });
}