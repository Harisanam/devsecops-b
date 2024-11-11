import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET = process.env.JWT_SECRET;


// Koneksi MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Terhubung ke MongoDB"))
  .catch(error => console.error("Koneksi ke MongoDB gagal:", error));