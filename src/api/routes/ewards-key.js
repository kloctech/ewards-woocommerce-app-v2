import { Router } from "express";
const router = Router();
import { getEwardsKey, createEwardsKey, updateEwardsKey, deleteEwardsKey, } from "../controllers/ewards-key/index.js";
import verifyEwardsKey from "../middlewares/ewards-key/verify-ewards-key.js";

router.get("/", getEwardsKey);
router.post("/", verifyEwardsKey, createEwardsKey);
router.put("/:id", verifyEwardsKey, updateEwardsKey);
router.delete("/:id", deleteEwardsKey);

export default router;
