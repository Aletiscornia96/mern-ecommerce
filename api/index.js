import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js';
import productsRoutes from './routes/product.route.js';
import userRoutes from './routes/user.route.js';
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import cosrs from 'cors';

dotenv.config({ path: './api/.env' });
const app = express();

//Middleware
app.use(cosrs());
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URL)
    .then(
        () => { console.log('Base de datos conectada') }
    ).catch(err => {
        console.log(err)
    });

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});