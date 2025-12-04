import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAllProducts, getFeaturedProduct } from '../controllers/product.controller.js';

const router=express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);

router.get("/featured",getFeaturedProduct)
router.post("/",protectRoute,adminRoute,createProduct);


export default router;
dunycejwk