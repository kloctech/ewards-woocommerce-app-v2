import { Router } from "express";
const router = Router();

import { getEwards, createEwards, redeemPoint, getLoyaltyInfo, customerLoyaltyVerify, redeemCoupon } from "../controllers/ewards/index.js";
import checkOrigin from '../middlewares/ewards/check-origin.js'

router.get("/", getEwards);
router.post("/", createEwards);
router.post("/customer-get-loyalty-info", checkOrigin, getLoyaltyInfo);
router.post("/customer-loyalty-verify", checkOrigin, customerLoyaltyVerify);
router.post("/redeem-coupon", checkOrigin, redeemCoupon);
router.post('/redeem-points', checkOrigin, redeemPoint)

export default router;
