import { EwardsMerchant, WooCommerce, EwardsKey, Customer } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";
import { loyaltyInfoRequestApiUrl } from "../../../config/index.js";
import { validateLoyaltyInfo } from "../../validators/loyalty.info.validator.js";
import axios from "axios";

export default async (req, res) => {
  const body = req.body;
  const origin = req.headers.origin;

  const { error } = validateLoyaltyInfo(body);

  if (error) {
    let code = "00025";
    return res.status(400).json(errorHelper(code, req, error.details[0].message));
  }

  if (body.store_url !== origin) return res.status(400).json(errorHelper("00106", req));

  const { ewards_merchant_id } = await WooCommerce.findOne({ store_url: body.store_url }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  if (!ewards_merchant_id) return res.status(400).json(errorHelper("00018", req));

  const customer = await Customer.findOne({ mobile: body.mobile_number }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  if (!customer) return res.status(400).json(errorHelper("00107", req));

  const ewardsKey = await EwardsKey.findOne({ ewards_merchant_id })
    .populate({
      path: "ewards_merchant_id",
      model: "EwardsMerchant",
    })
    .exec()
    .catch((err) => {
      return res.status(500).json(errorHelper("00000", req, err.message));
    });

  if (!ewardsKey) return res.status(400).json(errorHelper("00015", req));

  const requestBody = {
    customer_key: ewardsKey.customer_key,
    merchant_id: ewardsKey.ewards_merchant_id.merchant_id,
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
