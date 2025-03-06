import express from 'express';
import { userController, validateUser } from './userController';

const router = express.Router();

// Create user route with validation middleware
router.post('/users', validateUser, userController.createUser);

// Update user route (validation happens in controller)
router.patch('/users/:id', userController.updateUser);

export default router;
