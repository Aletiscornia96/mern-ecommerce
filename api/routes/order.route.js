import express from 'express';
import {
    createOrderFromCart,
    getMyOrders, getAllOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderById
} from '../controller/order.controller.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/from-cart', verifyToken, createOrderFromCart);
router.get('/mine', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);
router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.patch('/:id', verifyAdmin, updateOrderStatus);
router.patch('/:id/cancel', verifyToken, cancelOrder);


export default router;
