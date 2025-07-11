import { body } from 'express-validator';

export const signupValidations = [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').isLength({ min: 4 }).withMessage('La contraseña debe tener al menos 4 caracteres'),
];

export const signinValidations = [
  body('email').isEmail().withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

export const googleValidations = [
  body('token').notEmpty().withMessage('El token de Google es obligatorio'),
];
