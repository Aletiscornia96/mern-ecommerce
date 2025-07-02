import express from 'express';
// import { verifyToken } from '../middleware/auth.middleware.js';
import { getAllProducts, create, deleteProduct } from '../controller/product.controller.js' 


const router = express.Router();

router.post('/create', create)
router.get('/getallproducts', getAllProducts);
router.delete('/deleteproduct/:productId/:userId', deleteProduct)



export default router;