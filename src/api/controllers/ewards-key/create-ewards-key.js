import {
  EwardsKey,
  EwardsMerchant,
  WooCommerce,
} from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { merchantExists, wooCommerceExists } = req;

  let ewardsKey = new EwardsKey(req.body);

  // ewardsKey.ewards_merchant_id = EwardsMerchant._id;
  // ewardsKey.woo_commerce_id = WooCommerce._id;
  ewardsKey.ewards_merchant_id = merchantExists._id;
  ewardsKey.woo_commerce_id = wooCommerceExists._id;

  ewardsKey = await ewardsKey.save().catch((err) => {
    return res.status(500).json(err.errors);
  });

  logger(
    "00021",
    ewardsKey._id,
    getText("en", "00021"),
    "Info",
    req,
    "EwardsKey"
  );
  return res.status(200).json({
    resultMessage: { en: getText("en", "00021") },
    resultCode: "00021",
    ewardsKey,
  });
};
