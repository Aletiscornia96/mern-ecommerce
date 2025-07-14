import express from 'express';
import { verifyAdmin } from '../Middleware/authMiddleware.js';
import { getAllUsers, promoteUser, demoteUser } from '../controller/admin.controller.js';


const router = express.Router();


router.get('/', verifyAdmin, getAllUsers);
router.patch('/:id/promote', verifyAdmin, promoteUser);
router.patch('/:id/demote', verifyAdmin, demoteUser)

export default router;  