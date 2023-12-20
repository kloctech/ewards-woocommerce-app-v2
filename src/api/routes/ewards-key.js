import { Router } from 'express';
const router = Router();

import { getEwardsKey,createEwardsKey,updateEwardsKey} from "../controllers/ewards-key/index.js";

router.get('/:id', getEwardsKey);
router.post('/',createEwardsKey);
router.post('/:id',updateEwardsKey);


export default router