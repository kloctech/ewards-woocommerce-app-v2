import { Router } from 'express';
const router = Router();

import { getEwardsKey,createEwardsKey,updateEwardsKey,deleteEwardsKey} from "../controllers/ewards-key/index.js";

router.get('/', getEwardsKey);
router.post('/',createEwardsKey);
router.put('/:id',updateEwardsKey);
router.delete('/:id',deleteEwardsKey);


export default router