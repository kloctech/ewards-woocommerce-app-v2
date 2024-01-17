import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from "../../../utils/index.js";

export default async (req, res) => {
  const { ewardsKey } = req;

  await EwardsKey.create(ewardsKey)
    .then(ewardsKeyResponse => {
      logger("00021", ewardsKeyResponse._id, getText("en", "00021"), "Info", req, "EwardsKey");
      return res.status(200).json({
        resultMessage: { en: getText("en", "00021") },
        resultCode: "00021",
        ewardsKey,
      });
    })
    .catch((err) => {
      logger("00096", '', getText("en", "00096"), "Error", req, "EwardsKey");
      return res.status(500).json({
        resultMessage: { en: getText("en", "00096") },
        resultCode: "00096",
      });
    });
};


