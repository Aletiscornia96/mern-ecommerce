import express from 'express';
import { signup, signin, google } from '../controller/auth.controller.js';
import {
    signupValidations,
    signinValidations,
    googleValidations,
} from '../validations/auth.validations.js';
import { handleValidationErrors } from '../Middleware/validate.js';

const router = express.Router();

router.post('/signup', [...signupValidations, handleValidationErrors], signup);
router.post('/signin',[...signinValidations, handleValidationErrors], signin);
router.post('/google', [...googleValidations, handleValidationErrors], google);

export default router;