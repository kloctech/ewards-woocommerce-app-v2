import Joi from 'joi';

export function validateEwardsKey(body) {
  const schema = Joi.object({
    merchant_id: Joi.string().required(),
    store_url: Joi.string().required(),
    customer_key: Joi.string().required(),
    x_api_key: Joi.string().required()
  }); 
  return schema.validate(body);
}

