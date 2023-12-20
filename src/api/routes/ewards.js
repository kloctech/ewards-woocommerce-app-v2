import { Router } from 'express';
const router = Router();

import { getEwards,createEwards } from "../controllers/ewards/index.js";

router.get('/', getEwards);
router.post('/',createEwards);

export default router