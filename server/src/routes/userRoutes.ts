import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.ts';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.post('/', createUser);
router.delete('/:id', deleteUser);

export default router;