import express from 'express';
import { verifyAdmin } from '../Middleware/authMiddleware.js';
import { createCategory } from '../controller/category.controller.js';

const router = express.Router();

// Crear una nueva categoría (solo admin)
router.post('/', verifyAdmin, createCategory );

export default router;