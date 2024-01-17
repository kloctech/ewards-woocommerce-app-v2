import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const ewardsKeyId = req.params.id;
  const { ewardsKey } = req;

  await EwardsKey.findByIdAndUpdate({ _id: ewardsKeyId }, ewardsKey)
    .then(result => {
      logger("00022", ewardsKeyId, getText("en", "00022"), "Info", req, "EwardsKey");
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
          logger("00097", ewardsKeyId, getText("en", "00097"), "Error", req, "EwardsKey");
          return res.status(500).json({
            resultMessage: { en: getText("en", "00097") },
            resultCode: "00097",
          });
        }
      }
    )
};
