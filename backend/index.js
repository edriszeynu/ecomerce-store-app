import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';   


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());    

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes)
app.use("api/coupons",couponRoute)
app.use("/api/payments",paymentRoutes)

// Server + DB
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});
