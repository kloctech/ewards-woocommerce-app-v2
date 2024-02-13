import { Router } from "express";
const router = Router();

import { createCustomer, updateCustomer } from '../controllers/customer/index.js'

router.post('/create', createCustomer)
router.post('/update', updateCustomer)

export default router;