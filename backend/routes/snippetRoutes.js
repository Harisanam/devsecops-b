import express from 'express';
import { getSnippets, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippetController.js';


const router = express.Router();



router.get('/', getSnippets);
router.post('/', createSnippet); 
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);

export default router;
