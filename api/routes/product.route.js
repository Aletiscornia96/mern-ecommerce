import express from 'express';
import { getAllProducts, create, deleteProduct } from '../controller/product.controller.js' 


const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getallproducts', getAllProducts);
router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteProduct)



export default router;