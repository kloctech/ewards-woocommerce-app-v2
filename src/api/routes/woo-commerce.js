import { Router } from 'express';
const router = Router();

import { authCallback, authReturn, verify, deleteWooCommerce } from "../controllers/woo-commerce/index.js";

router.get('/auth-return', authReturn);
router.post('/auth-callback', authCallback);
router.post('/verify', verify);
router.delete('/delete_store', deleteWooCommerce)

export default router