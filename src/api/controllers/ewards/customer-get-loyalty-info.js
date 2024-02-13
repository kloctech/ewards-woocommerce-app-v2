import { WooCommerce } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";
import { loyaltyInfoRequestApiUrl } from "../../../config/index.js";
import { validateCustomerInfo } from "../../validators/customer.validator.js";
import axios from "axios";

export default async (req, res) => {
  const body = req.body;
  const origin = req.headers.origin;

  const { error } = validateCustomerInfo(body);

  if (error) {
    let code = "00025";
    return res.status(400).json(errorHelper(code, req, error.details[0].message));
  }

  if (body.store_url !== origin) return res.status(400).json(errorHelper("00106", req));

  const wooCommerce = await WooCommerce.findOne({ store_url: body.store_url })
    .populate({
      path: 'ewards_key_id',
      model: 'EwardsKey',
      populate: {
        path: 'ewards_merchant_id',
        model: 'EwardsMerchant',
      }
    })
    .populate({
      path: 'customers',
      model: 'WooCommerceCustomer',
      match: { mobile: body.mobile_number },
    }).exec()
    .catch((err) => {
      return res.status(500).json(errorHelper("00000", req, err.message));
    });

  if (!wooCommerce) return res.status(400).json(errorHelper("00018", req))

  const ewardsKey = wooCommerce.ewards_key_id;
  const merchant = ewardsKey.ewards_merchant_id;
  if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));
  if (!merchant) return res.status(400).json(errorHelper("00110", req));

  const customers = wooCommerce.customers;
  const customerExists = customers.find((customer) =>
    customer.woo_commerce_id.valueOf() === wooCommerce._id.valueOf()
  );
  if (!customerExists) {
    return res.status(400).json({
      resultMessage: { en: getText("en", "00107") },
      resultCode: "00107"
    });
  }
  const requestBody = {
    customer_key: ewardsKey.customer_key,
    merchant_id: merchant.merchant_id,
    mobile: body.mobile_number,
    country_code: body.country_code,
  };

  const requestHeader = {
    headers: {
      "x-api-key": ewardsKey.x_api_key,
    },
  };

  const { data: otpResponse } = await axios.post(loyaltyInfoRequestApiUrl, requestBody, requestHeader).catch((err) => {
    return res.status(500).json(errorHelper("00113", req, err.message));
  });

  if (otpResponse.status_code === 400)
    return res.status(400).json({
      resultMessage: { en: otpResponse.response.message },
    });

  return res.status(200).json({
    otpResponse,
  });
};
