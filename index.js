import express from "express";
import cors from "cors"; 
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PORT, JWT_SECRET, MONGO_URI } from "./config/config.js";
import Snippet from "./src/model/snippet.model.js";
import User from "./src/model/user.model.js";
import auth from "./src/middleware/auth.js";



const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://127.0.0.1:3000", "http://127.0.0.1:5500"] }));






mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });


  app.post('/api/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Periksa apakah email sudah terdaftar
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });
  
        // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
    
      // Simpan pengguna baru ke database
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
  
      // Buat token JWT
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.status(201).json({ user, token, message: 'Registrasi berhasil' });
    } catch (error) {
      res.status(500).json({ message: 'Registrasi gagal', error: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      // Temukan pengguna berdasarkan username
      const user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: 'Username tidak ditemukan' });
  
      // Verifikasi password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(400).json({ message: 'Password salah' });
  
      // Buat token JWT
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, message: 'Login berhasil' });
    } catch (error) {
      res.status(500).json({ message: 'Terjadi kesalahan', error: error.message });
    }
  });
  

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("PasteBox Server is running");
});

app.get("/db", (_, res) => {
  if (mongoose.connection.readyState === 1) {
    return res.status(200).send("Database ping successful");
  } else {
    return res.status(500).send("Failed to ping database");
  }
});

app.get("/api/snippets", auth, async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user._id });
    res.status(200).json({ success: true, data: snippets });
  } catch (error) {
    console.error("Error in fetching snippets: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/snippets", auth, async (req, res) => {
  const snippet = req.body;

  if (!snippet.title || !snippet.content) {
    return res
      .status(400)
      .json({ success: false, message: "Title and content are required" });
  }

  const newSnippet = new Snippet({ ...snippet, user: req.user._id });

  try {
    await newSnippet.save();
    res.status(201).json({ success: true, data: newSnippet });
  } catch (error) {
    console.error("Error in creating snippet: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/snippets/:id", auth, async (req, res) => {
  const { title, content, shared } = req.body;

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Title and content are required" });
  }

  try {
    const updatedSnippet = await Snippet.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, content, shared },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedSnippet) {
      return res
        .status(404)
        .json({ success: false, message: "Snippet not found" });
    }

    res.status(200).json({ success: true, data: updatedSnippet });
  } catch (error) {
    console.error("Error in updating snippet: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.delete("/api/snippets/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const deletedSnippet = await Snippet.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!deletedSnippet) {
      return res
        .status(404)
        .json({ success: false, message: "Snippet not found" });
    }
    res.status(200).json({ success: true, message: "Snippet deleted" });
  } catch (error) {
    console.error("Error in deleting snippet: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/snippets/:id", auth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const snippet = await Snippet.findOne({ _id: id, user: req.user._id });
    if (!snippet) {
      return res
        .status(404)
        .json({ success: false, message: "Snippet not found" });
    }
    res.status(200).json({ success: true, data: snippet });
  } catch (error) {
    console.error("Error in fetching snippet: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/api/snippets/shared/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const snippet = await Snippet.findOne({ _id: id, shared: true });
    if (!snippet) {
      return res
        .status(404)
        .json({ success: false, message: "Snippet not found" });
    }
    res.status(200).json({ success: true, data: snippet });
  } catch (error) {
    console.error("Error in fetching shared snippet: ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
