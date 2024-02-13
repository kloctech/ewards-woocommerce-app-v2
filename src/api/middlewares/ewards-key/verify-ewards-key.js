import { EwardsMerchant, WooCommerce } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";
import { validateEwardsKey } from "../../validators/ewards.key.validator.js";

export default async (req, res, next) => {
  const { error } = validateEwardsKey(req.body);
  const { merchant_id, store_url, customer_key, x_api_key, notes } = req.body
  if (error) {
    let code = "00025";
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }
  const merchant = await EwardsMerchant.findOne({
    merchant_id: merchant_id,
  }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  const wooCommerce = await WooCommerce.findOne({
    store_url: store_url,
  }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  const sendResponse = (statusCode, errorCode) => {
    return res.status(statusCode).json({
      resultMessage: { en: getText("en", errorCode) },
      resultCode: errorCode,
    });
  }

  if (!wooCommerce && !merchant) {
    sendResponse(404, "00019")
  } else if (!wooCommerce) {
    sendResponse(404, "00018")
  } else if (!merchant) {
    sendResponse(404, "00017")
  }

  req.merchant = merchant;
  req.wooCommerce = wooCommerce;

  next();
};
