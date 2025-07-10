import express from 'express';
import { verifyToken } from '../utils/authMiddleware.js';
import { getCart, addToCart, } from '../controller/cart.controller.js';

const router = express.Router();
router.get('/', verifyToken, getCart);
router.post('/add', verifyToken, addToCart);


export default router;  