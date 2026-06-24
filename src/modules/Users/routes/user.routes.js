import express from 'express';
import { signup, login, getCurrentUser } from '../controllers/user.controllers.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get(
    "/getCurrentUser",
    authMiddleware,
    getCurrentUser
);

export default router;