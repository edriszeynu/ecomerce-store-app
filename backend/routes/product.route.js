import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createProduct, getAllProducts, getFeaturedProduct } from '../controllers/product.controller.js';

const router=express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);

router.get("/featured",getFeaturedProduct)
router.post("/",protectRoute,adminRoute,createProduct);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);


export default router;