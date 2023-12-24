// import { EwardsMerchant } from "../../../models/index.js";
// import { errorHelper, logger, getText } from '../../../utils/index.js';

export default async (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  console.log(req.params);
  return res.status(200).json({body: req.body});
};
