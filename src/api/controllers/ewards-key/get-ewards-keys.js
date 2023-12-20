import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  const ewards = await EwardsKey.findOne({ _id: req.id }).catch(err => {
    return res.status(500).json(errorHelper('00088', req, err.message));
  });

  logger('00089', req.ewards, getText('en', '00089'), 'Info', req);
  return res.status(200).json({
    resultMessage: { en: getText('en', '00089'), tr: getText('tr', '00089') },
    resultCode: '00089',
    ewards
  });
};