import { Router } from "express";
const router = Router();
import { updateOrder, createOrder } from "../controllers/order/index.js";

router.post("/create", createOrder);
router.post("/update", updateOrder);

export default router;
