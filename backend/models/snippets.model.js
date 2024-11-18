import mongoose from "mongoose";

const snippetsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shared: { type: Boolean, default: false }, // Untuk publik atau privat
}, { timestamps: true });



const snippets = mongoose.model("snippets", snippetsSchema);

export default snippets;
