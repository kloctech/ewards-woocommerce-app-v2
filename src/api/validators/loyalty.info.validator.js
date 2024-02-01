import Joi from "joi";
export function validateLoyaltyInfo(body) {
  const schema = Joi.object({
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
    store_url: Joi.string().required(),
  });
  return schema.validate(body);
}
