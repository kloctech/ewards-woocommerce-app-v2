import { Router } from "express";
const router = Router();
import {
  getEwardsKey,
  createEwardsKey,
  updateEwardsKey,
  deleteEwardsKey,
} from "../controllers/ewards-key/index.js";
import VerifyEwardsKey from "../middlewares/ewards-key/verify-ewards-woocomm.js";

router.get("/", getEwardsKey);
router.post("/", VerifyEwardsKey, createEwardsKey);
router.put("/:id", VerifyEwardsKey, updateEwardsKey);
router.delete("/:id", deleteEwardsKey);

export default router;
