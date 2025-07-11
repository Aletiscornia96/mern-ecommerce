import express from 'express';
import { body } from 'express-validator';
import { verifyToken } from '../Middleware/authMiddleware.js';
import { getCart, addToCart, removeFromCart, updateCartProduct, clearCart, getCartTotal } from '../controller/cart.controller.js';
import { handleValidationErrors } from '../Middleware/validate.js';

const router = express.Router();
router.get('/', verifyToken, getCart);
router.get('/total', verifyToken, getCartTotal);
router.post('/add', verifyToken,
    [
        body('quantity').notEmpty().withMessage('La cantidad es obligatoria').isInt({ min: 1 }).withMessage('La cantidad debe ser un entero mayor o igual a 1'),
        handleValidationErrors,
    ],
    addToCart);
router.delete('/remove/:productId', verifyToken, removeFromCart);
router.patch('/update', verifyToken,
    [
        body('quantity').notEmpty().withMessage('La cantidad es obligatoria').isInt({ min: 1 }).withMessage('La cantidad debe ser un entero mayor a 0'),
        handleValidationErrors,
    ],
    updateCartProduct);
router.delete('/clear', verifyToken, clearCart);


export default router;  