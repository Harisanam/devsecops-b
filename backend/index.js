import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PORT, JWT_SECRET, MONGO_URI } from "./config.js";
import Snippet from "./model/snippet.model.js";
import User from "./model/user.model.js";
import auth from "./middleware/auth.js";

const app = express();

app.use(express.json());

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

app.post("/api/users/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).send({ error: "Invalid login credentials" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.send({ user, token });
  } catch (err) {
    res.status(400).send(err);
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
