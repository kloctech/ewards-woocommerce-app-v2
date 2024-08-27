import Joi from "joi";

export function validateCustomer(body) {
  const schema = Joi.object({
    first_name: Joi.string().required().allow(""),
    last_name: Joi.string().required().allow(""),
    mobile: Joi.string().allow(""),
    email: Joi.string().required(),
    woo_customer_id: Joi.number().required(),
    woo_commerce_id: Joi.object().required(),
    address: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    country_code: Joi.string().allow(""),
  });
  return schema.validate(body);
}

export function validateCustomerInfoVerify(body) {
  const schema = Joi.object({
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
    otp: Joi.string().required(),
    store_url: Joi.string().required(),
  });
  return schema.validate(body);
}

export function validateCustomerInfo(body) {
  const schema = Joi.object({
    mobile_number: Joi.string().required(),
    country_code: Joi.string().required(),
    store_url: Joi.string().required(),
  });
  return schema.validate(body);
}
