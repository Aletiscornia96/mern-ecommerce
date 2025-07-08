import express from 'express';
import { verifyToken } from '../utils/authMiddleware.js';
import { getCart } from '../controller/cart.controller.js';

const router = express.Router();
router.get('/', verifyToken, getCart);

export default router;  