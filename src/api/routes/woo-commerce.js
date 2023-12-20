import { Router } from 'express';
const router = Router();

import { authCallback,authReturn,verify } from "../controllers/woo-commerce/index.js";

router.get('/auth-return', authReturn);
router.post('/auth-callback',authCallback);
router.post('/verify',verify);

export default router