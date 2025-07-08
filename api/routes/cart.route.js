import express from 'express';
import { verifyAuthenticated } from '../utils/authMiddleware.js';
import { getCart } from '../controller/cart.controller.js';

const router = express.Router();
router.get('/', verifyAuthenticated, getCart);

export default router;