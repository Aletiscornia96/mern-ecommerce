import express from 'express';
import { verifyToken } from '../Middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, updateCartProduct, clearCart, getCartTotal } from '../controller/cart.controller.js';

const router = express.Router();
router.get('/', verifyToken, getCart);
router.get('/total', verifyToken, getCartTotal);
router.post('/add', verifyToken, addToCart);
router.delete('/remove/:productId', verifyToken, removeFromCart);
router.patch('/update', verifyToken, updateCartProduct);
router.delete('/clear', verifyToken, clearCart);


export default router;  