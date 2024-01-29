import { Router } from "express";
const router = Router();

import { createCustomer } from '../controllers/customer/index.js'

router.post('/customer_create', createCustomer)

export default router;