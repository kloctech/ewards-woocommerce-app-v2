import { EwardsMerchant } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  const ewards = await EwardsMerchant.find().catch(err => {
    return res.status(500).json(errorHelper('00088', req, err.message));
  });

  return res.status(200).json({
    resultMessage: { en: getText('en', '00089'), tr: getText('tr', '00089') },
    resultCode: '00089',
    ewards
  });
};
