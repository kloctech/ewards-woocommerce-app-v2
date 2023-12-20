import Joi from 'joi';

export function validateWooCommerce(body) {
  const schema = Joi.object({
    user_id: Joi.string().required(),
    consumer_key: Joi.string().required(),
    consumer_secret: Joi.string().required(),
    key_permissions: Joi.string().required(),
    key_id: Joi.number().required()
});

  return schema.validate(body);
}