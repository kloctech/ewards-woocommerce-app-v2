import { Router } from 'express';
const router = Router();

import { updateOrder } from "../controllers/order/index.js";
router.post('/update',updateOrder)

export default router