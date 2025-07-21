import express from 'express';
import { verifyAdmin } from '../Middleware/authMiddleware.js';
import {
    createCategory,
    getAllCategories,
    getCategoryBySlug,
    updateCategory,
    deleteCategory
} from '../controller/category.controller.js';

const router = express.Router();

router.post('/', verifyAdmin, createCategory);
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.patch('/:slug', verifyAdmin, updateCategory);
router.delete('/:slug', verifyAdmin, deleteCategory);




export default router;