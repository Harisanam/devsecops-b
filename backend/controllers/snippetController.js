// controllers/snippetController.js

import Snippet from '../models/snippet.model.js';

export const getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.status(200).json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving snippets' });
  }
};


const createSnippet = async (req, res) => {
  try {
    const { title, content } = req.body;
    const snippet = new Snippet({ title, content });
    await snippet.save();
    res.status(201).json(snippet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create snippet' });
  }
};

const getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve snippets' });
  }
};

const updateSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const snippet = await Snippet.findByIdAndUpdate(id, { title, content }, { new: true });
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update snippet' });
  }
};

const deleteSnippet = async (req, res) => {
  try {
    const { id } = req.params;
    const snippet = await Snippet.findByIdAndDelete(id);
    if (!snippet) return res.status(404).json({ error: 'Snippet not found' });
    res.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
};

export { createSnippet, getSnippets, updateSnippet, deleteSnippet };
