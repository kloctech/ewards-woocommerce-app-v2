import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { merchantExists, wooCommerceExists } = req;

  const ewardsKey = await EwardsKey.findOne({ _id: req.params.id }).catch(
    (err) => {
      if (err.message.indexOf("Cast to ObjectId failed") !== -1)
        return res.status(404).json({
          resultMessage: { en: getText("en", "00023") },
          resultCode: "00023",
        });

      return res.status(500).json({
        resultMessage: { en: getText("en", "00000") },
        resultCode: "Error while fetching the data on the database",
      });
    }
  );

  if (req.body.customer_key) ewardsKey.customer_key = req.body.customer_key;
  if (req.body.x_api_key) ewardsKey.x_api_key = req.body.x_api_key;
  if (req.body.notes) ewardsKey.notes = req.body.notes;
  if (req.body.merchant_id) ewardsKey.ewards_merchant_id = merchant._id;
  if (req.body.store_url) ewardsKey.woo_commerce_id = wooCommerce._id;

  await ewardsKey.save().catch((err) => {
    return res.status(500).json(errorHelper("00000", req, err.message));
  });

  logger(
    "00022",
    ewardsKey._id,
    getText("en", "00022"),
    "Info",
    req,
    "EwardsKey"
  );
  return res.status(200).json({
    resultMessage: { en: getText("en", "00022") },
    resultCode: "00022",
    ewardsKey,
  });
};
