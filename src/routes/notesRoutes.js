import { Router } from "express";
import { createNote, deleteNote, getAllNote, getNoteById, updateNote } from "../controllers/notesController.js";


const notesRouter = Router();

notesRouter.get('/notes', getAllNote);

notesRouter.get('/notes/:noteId', getNoteById);

notesRouter.post('/notes', createNote);

notesRouter.delete('/notes/:noteId', deleteNote);

notesRouter.patch('/notes/:noteId', updateNote);

export default notesRouter;
