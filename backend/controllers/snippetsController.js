import Snippets from '../models/snippets.model.js'; // Gunakan nama model yang benar


const loadPublicSnippets = async (req, res) => {
  try {
    const publicSnippets = await Snippets.find({ shared: true }, 'title content').sort({ createdAt: -1 });
    res.status(200).json(publicSnippets);
  } catch (error) {
    console.error('Error fetching public snippets:', error);
    res.status(500).json({ error: 'Failed to fetch public snippets' });
  }
};


const loadSnippets = async (req, res) => {
  try {
    const userSnippets = await Snippets.find({ user: req.user.userId })
      .select('_id title content shared')
      .sort({ createdAt: -1 });
    res.status(200).json(userSnippets);
  } catch (error) {
    console.error('Error retrieving snippets:', error);
    res.status(500).json({ error: 'Failed to retrieve snippets' });
  }
};


const createSnippets = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const userId = req.user.userId;
    const newSnippets = new Snippets({ title, content, user: userId });

    await newSnippets.save();
    res.status(201).json(newSnippets);
  } catch (error) {
    console.error('Error creating snippet:', error);
    res.status(500).json({ error: 'Failed to create snippet' });
  }
};



const updateSnippets = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    console.log('ID snippet:', id);
    console.log('Data yang diterima:', req.body);

    // Validasi input
    if (!title || !content) {
      console.warn('Title atau content tidak ada dalam request body');
      return res.status(400).json({ error: 'Title and content are required' });
    }

    await updateSnippets(id, { title: 'Updated Title', content: 'Updated Content' });


    if (!snippets) {
      console.warn('Snippet tidak ditemukan atau pengguna tidak berwenang');
      return res.status(404).json({ error: 'Snippet not found or unauthorized' });
    }

    console.log('Snippet berhasil diperbarui:', snippets);
    res.status(200).json({ snippets });
  } catch (error) {
    console.error('Kesalahan saat memperbarui snippet:', error.message);
    res.status(500).json({ error: 'Failed to update snippet' });
  }
};



const deleteSnippets = async (req, res) => {
  try {
    const { id } = req.params;

    const snippets = await Snippets.findOneAndDelete({ _id: id, user: req.user.userId }); // Validasi kepemilikan

    if (!snippets) return res.status(404).json({ error: 'Snippet not found' });

    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
};

const shareSnippets = async (req, res) => {
  try {
    console.log('Permintaan berbagi snippet diterima. ID:', req.params.id);
    console.log('Pengguna yang meminta:', req.user);

    const snippets = await Snippets.findOne({ _id: req.params.id, user: req.user.userId });
    if (!snippets) {
      console.warn('Snippet tidak ditemukan atau pengguna tidak berwenang.');
      return res.status(404).json({ error: 'Snippet not found or unauthorized' });
    }

    console.log('Snippet sebelum diperbarui:', snippets);

    // Toggle status shared
    snippets.shared = !snippets.shared;
    await snippets.save();

    console.log('Snippet setelah diperbarui:', snippets);

    res.status(200).json({
      message: 'Snippet share status updated',
      snippets: {
        _id: snippets._id,
        title: snippets.title,
        content: snippets.content,
        shared: snippets.shared,
      },
    });
  } catch (error) {
    console.error('Kesalahan saat memperbarui status berbagi snippet:', error.message);
    res.status(500).json({ error: 'Failed to update share status' });
  }
};




export { createSnippets, loadSnippets, loadPublicSnippets, updateSnippets, deleteSnippets, shareSnippets };
