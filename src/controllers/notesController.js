import createHttpError from 'http-errors';
import { Note } from "../models/note.js";


export const getAllNote = async (req, res) => {
  const notes = await Note.find();
  res.json({
    status: 200,
    message: 'Successfuly find',
    data: notes,
  });
};

export const getNoteById = async(req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.json({
    status: 200,
    message: "Student for Id is found",
    data: note,
  });
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Note created successfully",
    data: note,
  });
};

export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note  = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
     return next(createHttpError(404, "Note not found"));
  }
  res.json({
    status: 200,
    message: "Note deleted successfully",
    data: note,
  });
};

export const updateNote = async (req, res,next) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndUpdate({ _id: noteId }, req.body, { new: true });
  if (!note) {
      return next(createHttpError(404, "Note not found"));

  }
  res.json({
    status: 200,
    message: "Note updated successfully",
    data: note,
  });
};
