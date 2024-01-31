import Joi from 'joi';

export function validateLoyaltyVerify(body) {
  const schema = Joi.object({
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
    otp: Joi.string().required(),
    store_url: Joi.string().required(),

  });
  return schema.validate(body);
}
