import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT, MONGO_URI } from './config/config.js';  // Mengambil PORT dan MONGO_URI dari config
import authRoutes from './routes/authRoutes.js';
import snippetsRoutes from './routes/snippetsRoutes.js';
import './config/config.js'; // Koneksi MongoDB sudah diatur di file ini


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001', // Domain frontend Anda
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Metode HTTP yang diizinkan
  allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
}));

// Routes
app.use('/api/auth', authRoutes);       // Rute untuk autentikasi
app.use('/api/snippets', snippetsRoutes); // Rute untuk snippets (contoh tambahan)



app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  const message = err.name === 'ValidationError' ? 'Invalid data provided' : err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
