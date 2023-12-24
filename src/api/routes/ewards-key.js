import { Router } from 'express';
const router = Router();

import { getEwardsKey,createEwardsKey,updateEwardsKey} from "../controllers/ewards-key/index.js";

router.get('/:id', getEwardsKey);
router.post('/',createEwardsKey);
router.put('/:id',updateEwardsKey);


export default router