import express from 'express';
import { getUserById, updateUser, deleteUser } from '../controller/user.controller.js';
import { verifyUser } from '../utils/authMiddleware.js';

const router = express.Router();

// Ruta protegida: solo el usuario dueño o admin puede acceder
router.get('/:id', verifyUser, getUserById);
router.put('/:id', verifyUser, updateUser);
router.delete('/:id', verifyUser, deleteUser);


export default router;