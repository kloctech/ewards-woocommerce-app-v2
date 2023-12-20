import Joi from 'joi';

export function validateEwardsMerchant(body) {
  const schema = Joi.object({
    merchant_id: Joi.string().required(),
    woo_commerce: {
      store_url: Joi.string().required()
    }
});
  return schema.validate(body);
}