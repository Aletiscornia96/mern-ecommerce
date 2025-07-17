import express from 'express';
import { verifyAdmin } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Crear una nueva categoría (solo admin)
router.post('/', verifyAdmin );