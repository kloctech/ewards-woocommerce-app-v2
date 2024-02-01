import { Router } from 'express';
const router = Router();

import { getEwards, createEwards, customerLoyaltyVerify } from "../controllers/ewards/index.js";

router.get('/', getEwards);
router.post('/', createEwards);
router.post('/customer-loyalty-verify', customerLoyaltyVerify);

export default router