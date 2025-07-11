import express from 'express';
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getOneProduct,
    getAllProducts,
} from '../controller/product.controller.js'
import { verifyAdmin } from '../Middleware/authMiddleware.js';


const router = express.Router();

router.post('/', verifyAdmin, createProduct);
router.put('/:productId', verifyAdmin, updateProduct);
router.delete('/:productId', verifyAdmin, deleteProduct);
router.get('/slug/:slug', getOneProduct);
router.get('/', getAllProducts);


export default router;