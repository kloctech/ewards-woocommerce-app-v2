import { Customer, WooCommerce } from "../../../models/index.js";
import { errorHelper, getText, logger } from "../../../utils/index.js";
import { validateCustomer } from "../../validators/customer.validator.js";

export default async (req, res) => {
  const body = req.body;
  const url = body._links?.self[0].href || '';
  const storeUrl = await url.substring(0, url.indexOf('/wp-json'));

  const wooCommerce = await WooCommerce.findOne({ store_url: storeUrl }).catch((err) => {
    return res.status(500).json(errorHelper("00018", req, err.message));
  });

  if (!wooCommerce) return res.status(404).json(errorHelper("00018", req));

  const customerObj = {
    first_name: body.first_name,
    last_name: body.last_name,
    mobile: body.billing.phone,
    address: `${body.billing.address_1} - ${body.billing.address_2}`,
    city: body.billing.city,
    email: body.email,
    state: body.billing.state,
    woo_customer_id: body.id,
    woo_commerce_id: wooCommerce._id,
    country_code: "+91" // todo: different country code
  }
  const { error } = validateCustomer(customerObj);
  if (error) {
    let code = "00025";
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  const customer = await new Customer(customerObj).save().catch(err => {
    console.log(err)
    logger('00104', "", getText('en', '00104'), 'Error', '', "Customer");
    return res.status(400).json({
      resultMessage: { en: getText('en', '00104') },
      resultCode: '00104'
    });
  })
  logger('00105', customer._id, getText('en', '00105'), 'Info', '', "Customer");
  return res.status(200).json({
    resultMessage: { en: getText('en', '00105') },
    resultCode: '00105',
    customer
  });
}
