import { Router } from 'express';
const router = Router();

import { createOrder, updateOrder } from "../controllers/order/index.js";

router.post('/create', createOrder)
router.post('/update', updateOrder)

export default router