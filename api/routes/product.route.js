import express from 'express';
import { 
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    getAllProducts, 
} from '../controller/product.controller.js'
import { verifyAdmin } from '../utils/authMiddleware.js'; 


const router = express.Router();

router.post('/', verifyAdmin, createProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);
router.get('/:id', getProduct);
router.get('/', getAllProducts);



export default router;


