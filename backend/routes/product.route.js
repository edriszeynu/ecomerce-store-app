import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { createProduct, deleteProduct, getAllProducts, getFeaturedProduct, getRecommendedProducts } from '../controllers/product.controller.js';

const router=express.Router();

router.get("/",protectRoute,adminRoute,getAllProducts);

router.get("/featured",getFeaturedProduct)
router.post("/",protectRoute,adminRoute,createProduct);
router.get("/catagory/:catagory",getByProductsCatagory);
router.get("recommendations",getRecommendedProducts);
router.delete("/:id",protectRoute,adminRoute,deleteProduct);


export default router;