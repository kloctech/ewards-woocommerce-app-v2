import { WooCommerce, Customer } from "../../../models/index.js";
import { errorHelper } from "../../../utils/index.js";
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

  const woocommerce = await WooCommerce.aggregate([
    {
      $match: { store_url: body.store_url },
    },
    {
      $lookup: {
        from: "ewardsmerchants",
        localField: "ewards_merchant_id",
        foreignField: "_id",
        as: "merchant",
      },
    },
    {
      $lookup: {
        from: "ewardskeys",
        localField: "ewards_merchant_id",
        foreignField: "ewards_merchant_id",
        as: "ewardsKey",
      },
    },
  ]);

  const { merchant: [merchant] = [], ewardsKey: [ewardsKey] = [] } = woocommerce[0];

  if (!woocommerce) return res.status(400).json(errorHelper("00018", req));
  if (!merchant) return res.status(400).json(errorHelper("00110", req));
  if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));

  const customer = await Customer.findOne({ mobile: body.mobile_number, woo_commerce_id: woocommerce[0]._id }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  if (!customer) return res.status(400).json(errorHelper("00107", req));

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
      resultMessage: { en: otpResponse.message },
    });

  return res.status(200).json({
    otpResponse,
  });
};
