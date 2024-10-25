import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.route.js';


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(
        () => { console.log('Base de datos conectada') }
    ).catch(err => {
        console.log(err)
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use ((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});