import express from "express";
import { checkOutSuccess, createCheckOutSession } from "../controllers/payment.controller.js";


const router=express.Router();

router.post("/create-checkout-session", createCheckOutSession)
router.post("/checkOut-succcess",protectRoute,checkOutSuccess)
  


export default router;