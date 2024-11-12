import express from 'express';
import { register, login, logout } from '../controllers/authController.js';

const router = express.Router();

// Rute untuk login
router.post('/login', login);     // Memetakan POST /api/login ke fungsi login di authController.js
router.post('/register', register); // Rute untuk register
router.post('/logout', logout);    // Rute untuk logout

export default router;
