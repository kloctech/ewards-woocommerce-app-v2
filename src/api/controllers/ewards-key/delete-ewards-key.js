import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {

  try {
    const ewardsKey = await EwardsKey.deleteOne({ _id: req.params.id });
    logger('00024', ewardsKey._id, getText('en', '00024'), 'Info', req, "EwardsKey");
    return res.status(200).json({
      resultMessage: { en: getText('en', '00024') },
      resultCode: '00024',
      ewards_key: ewardsKey
    });
  } catch (err) {
    if (err.message.indexOf('Cast to ObjectId failed') !== -1) {
      logger('00023', '', getText('en', '00023'), 'Error', req, "EwardsKey");
      return res.status(404).json({
        resultMessage: { en: getText('en', '00023') },
        resultCode: '00023'
      });
    }
    logger('00098', '', getText('en', '00098'), 'Error', req, "EwardsKey");
    return res.status(500).json({
      resultMessage: { en: getText('en', '00000') },
      resultCode: "Error while fetching the data on the database"
    });
  }
};
