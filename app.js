const express = require('express');
const Snippet = require('./models/snippet'); // import model snippet
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk menambahkan snippet baru
app.post('/api/snippets', async (req, res) => {
   try {
      const newSnippet = new Snippet({
         title: req.body.title,
         content: req.body.content,
         shared: req.body.shared || false
      });
      const savedSnippet = await newSnippet.save();
      res.status(201).json(savedSnippet);
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

