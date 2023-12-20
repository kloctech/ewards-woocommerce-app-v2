import { EwardsKey } from "../../../models/index.js";
import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  
  const exists = await EwardsKey.findOne({ _id: req.id })
  .catch((err) => {
    return res.status(500).json(errorHelper('00031', req, err.message));
  });
  
  if (!exists) return res.status(409).json(errorHelper('00032', req));
  
  let ewardsKey = new EwardsKey(req.body)

  ewardsKey = await ewardsKey.save().catch((err) => {
    return res.status(500).json(errorHelper('00014', req, err.message));
  });
  return res.status(200).json({
    resultMessage: { en: getText('en', '00014') },
    resultCode: '00014', ewardsKey
  });
}