import express from 'express';
import { body } from 'express-validator';
import { getUserById, updateUser, deleteUser } from '../controller/user.controller.js';
import { verifyAdmin, verifyUser } from '../Middleware/authMiddleware.js';
import { handleValidationErrors } from '../Middleware/validate.js';

const router = express.Router();

// Ruta protegida: solo el usuario dueño o admin puede acceder
router.get('/:id', verifyUser, getUserById);
router.patch('/:id', verifyUser,
    [
        body('email').optional().isEmail().withMessage('Debe ser un email válido'),
        body('password').optional().isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
        body('username').optional().notEmpty().withMessage('El nombre de usuario no puede estar vacío'),
        body('phone').optional().isNumeric().withMessage('El teléfono debe contener solo números'),
        body('address').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
        handleValidationErrors,
    ],
    updateUser);
router.delete('/:id', verifyAdmin, deleteUser);


export default router;