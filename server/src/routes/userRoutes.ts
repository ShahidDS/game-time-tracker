import express from 'express';
import { getUsers, getUserById, createUser, updateUser } from '../controllers/userController.ts';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.post('/', createUser);

export default router;