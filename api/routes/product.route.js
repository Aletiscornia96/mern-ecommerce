import express from 'express';
import { body } from 'express-validator';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getOneProduct,
    getAllProducts,
} from '../controller/product.controller.js'
import { verifyAdmin } from '../Middleware/authMiddleware.js';
import { handleValidationErrors } from '../Middleware/validate.js';


const router = express.Router();

router.post('/', verifyAdmin,
    [
        body('name').notEmpty().withMessage('El nombre del producto es obligatorio'),
        body('price').notEmpty().withMessage('El precio es obligatorio').isFloat({ min: 0 }).withMessage('El precio debe ser un número mayor a 0'),
        body('category').notEmpty().withMessage('La categoría es obligatoria'),
        body('color').optional().isString().withMessage('El color debe ser texto'),
        body('stock').notEmpty().withMessage('El stock del producto es obligatorio').isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor a 0'),
        handleValidationErrors,
    ],
    createProduct);
router.get('/slug/:slug', getOneProduct);
router.get('/', getAllProducts);
router.patch('/:productId', verifyAdmin,
    [
        body('name').optional().isString().withMessage('El nombre debe ser texto'),
        body('price').optional().isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
        body('category').optional().isString().withMessage('La categoría debe ser texto'),
        body('size').optional().isString().withMessage('El tamaño debe ser texto'),
        body('color').optional().isString().withMessage('El color debe ser texto'),
        body('stock').optional().isInt({ min: 0 }).withMessage('El stock debe ser un número entero mayor a 0'),
        handleValidationErrors,
    ],
    updateProduct);
router.delete('/:productId', verifyAdmin, deleteProduct);

export default router;