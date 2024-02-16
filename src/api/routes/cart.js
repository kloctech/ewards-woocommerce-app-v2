import { Router } from 'express';
const router = Router();

import { getCart } from "../controllers/cart/index.js";

router.get('/', getCart);
// router.post('/',getCart);

export default router