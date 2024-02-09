import { Router } from 'express';
const router = Router();

import { getEwards,createEwards,redeemPoint } from "../controllers/ewards/index.js";

router.get('/', getEwards);
router.post('/',createEwards);
router.post('/redeem-points',redeemPoint)

export default router