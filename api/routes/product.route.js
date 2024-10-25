import express from 'express';
import { getAllProducts } from '../controller/product.controller.js' 


const router = express.Router();

app.get('/getallproducts', getAllProducts);


export default router;