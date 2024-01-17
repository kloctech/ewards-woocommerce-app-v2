import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const ewardsKeyId = req.params.id;
  const { merchantExists, wooCommerceExists } = req;
  const { customer_key, x_api_key, notes, merchant_id, store_url } = req.body
  const ewardsKey = {
    ...(customer_key && { customer_key }),
    ...(x_api_key && { x_api_key }),
    ...(notes && { notes }),
    ...(merchant_id && { ewards_merchant_id: merchantExists }),
    ...(store_url && { woo_commerce_id: wooCommerceExists }),
  };

  const result = await EwardsKey.findByIdAndUpdate({ _id: ewardsKeyId }, ewardsKey)
    .then(result => {
      logger("00022", ewardsKey._id, getText("en", "00022"), "Info", req, "EwardsKey");
      return res.status(200).json({
        resultMessage: { en: getText("en", "00022") },
        resultCode: "00022",
        ewardsKey,
      });
    }).catch(
      (err) => {
        if (err.message.indexOf("Cast to ObjectId failed") !== -1) {
          logger("00023", ewardsKeyId, getText("en", "00023"), "Error", req, "EwardsKey");
          return res.status(404).json({
            resultMessage: { en: getText("en", "00023") },
            resultCode: "00023",
          });
        } else {
          logger("00097", ewardsKey._id, getText("en", "00097"), "Error", req, "EwardsKey");
          return res.status(500).json({
            resultMessage: { en: getText("en", "00098") },
            resultCode: "00098",
          });
        }
      }
    )
};
