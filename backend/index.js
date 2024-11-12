import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PORT, MONGO_URI } from './config/config.js';  // Mengambil PORT dan MONGO_URI dari config
import authRoutes from './routes/authRoutes.js';
import snippetRoutes from './routes/snippetRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);       // Rute untuk autentikasi
app.use('/api/snippets', snippetRoutes); // Rute untuk snippet (contoh tambahan)

// Koneksi MongoDB (Sudah diatur di config.js)
import mongoose from 'mongoose';

mongoose.connect(MONGO_URI, {

})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
