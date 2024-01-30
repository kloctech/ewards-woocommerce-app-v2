import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import { specs, swaggerConfig } from "../../config/index.js";
import user from "./user.js";
import ewards from "./ewards.js";
import ewardskey from "./ewards-key.js";
import woocommerce from "./woo-commerce.js";
import cart from "./cart.js";
import customer from "./customer.js"

const router = Router();

const specDoc = swaggerJsdoc(swaggerConfig);

router.use(specs, serve);
router.get(specs, setup(specDoc, { explorer: true }));

router.use("/user", user);
router.use("/ewards", ewards);
router.use("/woo-commerce", woocommerce);
router.use("/ewards-key", ewardskey);
router.use("/cart", cart);
router.use('/customer', customer)

export default router;
