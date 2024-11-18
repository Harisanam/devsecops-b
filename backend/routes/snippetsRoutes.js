import express from 'express';
import { createSnippets, loadSnippets,loadPublicSnippets, updateSnippets, deleteSnippets,shareSnippets } from '../controllers/snippetsController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Impor middleware

const router = express.Router();


router.get('/public', loadPublicSnippets)


router.use(authMiddleware); // Terapkan middleware ke semua rute di sini

router.post('/', createSnippets);
router.get('/', loadSnippets);
router.put('/:id', updateSnippets);
router.delete('/:id', deleteSnippets);
router.patch('/:id/share', authMiddleware, shareSnippets);

export default router;
