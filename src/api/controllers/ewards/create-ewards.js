import { EwardsMerchant,WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';
import { validateEwardsMerchant } from '../../validators/ewards.validator.js';

export default async (req, res) => {
  let body = req.body;

  const { error } = validateEwardsMerchant(body);

  if (error) {
    let code = '00025';
    if (error.details[0].message.includes('merchant_id'))
      code = '00001';
    else if (error.details[0].message.includes('woo_commerce'))
      code = '00004';
    return res.status(400).json(errorHelper(code, req, error.details[0].message));
  }

  const woo_commerce_exists = await WooCommerce.exists({ store_url: body.woo_commerce.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00005', req, err.message));
  });

  if (woo_commerce_exists) return res.status(409).json(errorHelper('00005', req));

  const ewards_exists = await EwardsMerchant.exists({ merchant_id: body.merchant_id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00003', req, err.message));
  });

  let ewards_merchant = new EwardsMerchant(body);
  let woo_commerce = new WooCommerce(body["woo_commerce"])

  if (ewards_exists) {
    woo_commerce.ewards_merchant_id = ewards_exists._id
    woo_commerce = await woo_commerce.save().catch((err) => {
      return res.status(500).json(errorHelper('00034', req, err.message));
    });
  } else {
    ewards_merchant = ewards_merchant.save()
    .then(async (ewards)=>  {
      woo_commerce.ewards_merchant_id = ewards._id
      woo_commerce = await woo_commerce.save().catch((err) => {
        return res.status(500).json(errorHelper('00034', req, err.message));
      });
    })
    .catch((err) => {
      return res.status(500).json(errorHelper('00034', req, err.message));
    });
    logger('00002', ewards_merchant._id, getText('en', '00002'), 'Info', req, "EwardsMerchant" );
  }

  return res.status(200).json({
    resultMessage: { en: getText('en', '00002') },
    resultCode: '00002', ewards_merchant, woo_commerce
  });
  
}

/**
 * @swagger
 * /createwards:
 *    get:
 *      summary: Create Ewards Merchant
 *      parameters:
 *       
 *      tags:
 *        - Ewards
 *      responses:
 *        "200":
 *          description: Successfully Created EwardsMerchant.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                         user:
 *                              $ref: 
 *       
 *        "500":
 *          description: Access denied.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */