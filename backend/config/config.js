import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI tidak tersedia di file .env");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.error("Error: JWT_SECRET tidak tersedia di file .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Terhubung ke MongoDB"))
  .catch((error) => {
    console.error("Koneksi ke MongoDB gagal:", error);
    process.exit(1);
  });

export { PORT, MONGO_URI, JWT_SECRET };
