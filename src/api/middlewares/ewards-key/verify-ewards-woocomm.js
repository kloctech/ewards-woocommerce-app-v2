import { EwardsMerchant, WooCommerce } from "../../../models/index.js";
import { errorHelper, getText } from "../../../utils/index.js";
import { validateEwardsKey } from "../../validators/ewards.key.validator.js";

export default async (req, res, next) => {
  const { error } = validateEwardsKey(req.body);

  if (error) {
    let code = "00025";
    if (
      error.details[0].message.includes("merchant_id") ||
      error.details[0].message.includes("store_url") ||
      error.details[0].message.includes("x_api_key") ||
      error.details[0].message.includes("customer_key")
    ) {
      code = "00038";
    }
    return res
      .status(400)
      .json(errorHelper(code, req, error.details[0].message));
  }

  const merchantExists = await EwardsMerchant.exists({
    merchant_id: req.body.merchant_id,
  }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  const wooCommerceExists = await WooCommerce.exists({
    store_url: req.body.store_url,
  }).catch((err) => {
    return res.status(500).json(errorHelper("00031", req, err.message));
  });

  if (!wooCommerceExists && !merchantExists) {
    return res.status(404).json({
      resultMessage: { en: getText("en", "00019") },
      resultCode: "00019",
    });
  } else if (!wooCommerceExists) {
    return res.status(404).json({
      resultMessage: { en: getText("en", "00018") },
      resultCode: "00018",
    });
  } else if (!merchantExists) {
    return res.status(404).json({
      resultMessage: { en: getText("en", "00017") },
      resultCode: "00017",
    });
  }

  req.merchantExists = merchantExists;
  req.wooCommerceExists = wooCommerceExists;

  next();
};
