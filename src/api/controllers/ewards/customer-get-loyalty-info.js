import { EwardsMerchant, WooCommerce, EwardsKey, Customer } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";
import { loyaltyInfoRequestApiUrl } from "../../../config/index.js";
import { validateLoyaltyInfo } from "../../validators/loyalty.info.validator.js";
import axios from "axios";

export default async (req, res) => {
  const body = req.body;
  const requestOrigin = req.headers.origin;
  const { error } = validateLoyaltyInfo(body);
  if (error) {
    let code = "00025";
    return res.status(400).json(errorHelper(code, req, error.details[0].message));
  }

  if (requestOrigin !== body.store_url) return res.status(400).json(errorHelper("00106", req));

  const customer = await Customer.findOne({ mobile: body.mobile_number, country_code: body.country_code });

  if (!customer) return res.status(400).json(errorHelper("00107", req));

  const woocommerce = await WooCommerce.findOne({ store_url: body.store_url }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  if (!woocommerce) {
    return res.status(400).json(errorHelper("00018", req));
  }

  const merchant = await EwardsMerchant.findById(woocommerce.ewards_merchant_id);

  if (!merchant) {
    return res.status(404).json(errorHelper("00017", req));
  }
  const ewardsKey = await EwardsKey.findOne({ ewards_merchant_id: merchant._id }).catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  if (!ewardsKey) {
    return res.status(404).json(errorHelper("00015", req));
  }

  const ewardsRequestBody = {
    customer_key: ewardsKey.customer_key,
    merchant_id: merchant.merchant_id,
    mobile: body.mobile_number,
    country_code: body.country_code,
  };

  const ewardsRequestHeader = {
    headers: {
      "x-api-key": ewardsKey.x_api_key,
    },
  };
  const { data: loyalty_info } = await axios.post(loyaltyInfoRequestApiUrl, ewardsRequestBody, ewardsRequestHeader).catch((err) => {
    return res.status(500).json(errorHelper("00113", req, err.message));
  });

  if (loyalty_info.status_code === 400) return res.status(400).json(errorHelper("00113", req));

  return res.status(200).json({
    resultMessage: { en: getText("en", "00112") },
    resultCode: "00112",
    loyalty_info,
  });
};
