import { frontendUrl } from '../../../config/index.js';
import { errorHelper } from "../../../utils/index.js";

export default async (req, res, next) => {
  const origin = req.headers.origin;

  if (frontendUrl !== origin) return res.status(400).json(errorHelper("00106", req));

  next()
}