import { Router } from "express";
const router = Router();

import { getEwards, createEwards, getLoyaltyInfo, customerLoyaltyVerify } from "../controllers/ewards/index.js";

router.get("/", getEwards);
router.post("/", createEwards);
router.post("/customer-loyalty-verify", customerLoyaltyVerify);
router.post("/customer-get-loyalty-info", getLoyaltyInfo);

export default router;
