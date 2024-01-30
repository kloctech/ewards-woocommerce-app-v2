import { Router } from "express";
const router = Router();

import { createCustomer } from '../controllers/customer/index.js'

router.post('/create', createCustomer)

export default router;