import express from 'express';
import { body } from 'express-validator';
import {
    createOrderFromCart,
    getMyOrders, getAllOrders,
    updateOrderStatus,
    cancelOrder,
    getOrderById
} from '../controller/order.controller.js';
import { verifyToken, verifyAdmin } from '../Middleware/authMiddleware.js';
import { handleValidationErrors } from '../Middleware/validate.js';

const router = express.Router();

router.post('/from-cart', verifyToken,
    [
        body('shippingAddress').optional().isLength({ min: 5 }).withMessage('La dirección debe tener al menos 5 caracteres'),
        handleValidationErrors
    ],
    createOrderFromCart);
router.get('/mine', verifyToken, getMyOrders);
router.get('/:id', verifyToken, getOrderById);
router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.patch('/:id', verifyAdmin,
    [
        body('status').notEmpty().withMessage('El estado es obligatorio').isIn(['pendiente', 'procesando', 'completada', 'cancelada'])
            .withMessage('Estado no válido'),
        handleValidationErrors,
    ],
    updateOrderStatus);
router.patch('/:id/cancel', verifyToken, cancelOrder);


export default router;
