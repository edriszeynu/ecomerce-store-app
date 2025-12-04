import express from 'express';
import { signup, login, logout, refreshToken } from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/logout
router.post('/logout', logout);

// POST /api/auth/refresh-token
router.post('/refresh-token', refreshToken);
 
router.get("/profile",getProfile)
export default router;
