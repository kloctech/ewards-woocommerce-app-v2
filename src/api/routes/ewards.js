import { Router } from "express";
const router = Router();

import { getEwards, createEwards, redeemPoint, getLoyaltyInfo, customerLoyaltyVerify, redeemCoupon } from "../controllers/ewards/index.js";

router.get("/", getEwards);
router.post("/", createEwards);
router.post("/customer-loyalty-verify", customerLoyaltyVerify);
router.post("/customer-get-loyalty-info", getLoyaltyInfo);
router.post("/redeem-coupon", redeemCoupon);
router.post('/redeem-points', redeemPoint)

export default router;
