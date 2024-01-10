import { EwardsKey,WooCommerce } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  /*  #swagger.tags = ['EwardsKey']
      #swagger.description = 'Endpoint to get the specific ewards-key.' */
  let wooCommerce = await WooCommerce.exists({ store_url: req.query.store_url })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });

  if (!wooCommerce) return res.status(404).json(errorHelper('00023', req));


  const ewardsKey =  await EwardsKey.findOne({ woo_commerce_id: wooCommerce._id })
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

  if (!ewardsKey) return res.status(404).json(errorHelper('00023', req));

  logger('00020', ewardsKey._id, getText('en', '00020'), 'Info',req, "EwardsKey");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00020') },
    resultCode: '00020',
    ewards_key: ewardsKey
  });
};
/**
 * @swagger
 * /user/{:id}:
 *    get:
 *      summary: Get EwardsKey Info
 *      parameters:
 *          -in: params
 *          name: id
 *          schema:
 *            type: string
 *          description: Put id here
 *      tags:
 *        - EwardsKey
 *      responses:
 *        "200":
 *          description: The user information has gotten successfully.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          resultMessage:
 *                              $ref: '#/components/schemas/ResultMessage'
 *                          resultCode:
 *                              $ref: '#/components/schemas/ResultCode'
 *                          user:
 *                              $ref: '#/components/schemas/User'
 *        "401":
 *          description: Invalid token.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 *        "500":
 *          description: An internal server error occurred, please try again.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Result'
 */