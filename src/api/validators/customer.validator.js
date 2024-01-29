import Joi from 'joi';

export function validateCustomer(body) {
  const schema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    mobile: Joi.string().allow(''),
    email: Joi.string().required(),
    woo_customer_id: Joi.number().required(),
    woo_commerce_id: Joi.object().required(),
    address: Joi.string().allow(''),
    city: Joi.string().allow(''),
    state: Joi.string().allow(''),
    country_code: Joi.string().allow('')
  });
  return schema.validate(body);
}

