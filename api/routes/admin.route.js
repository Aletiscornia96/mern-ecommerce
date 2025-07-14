import express from 'express';
import { verifyAdmin } from '../Middleware/authMiddleware.js';
import { getAllUsers, promoteUser, demoteUser } from '../controller/admin.controller.js';
import { getUserById } from '../controller/user.controller.js';


const router = express.Router();


router.get('/', verifyAdmin, getAllUsers);
router.get('/:id', verifyAdmin, getUserById);
router.patch('/:id/promote', verifyAdmin, promoteUser);
router.patch('/:id/demote', verifyAdmin, demoteUser)

export default router;  