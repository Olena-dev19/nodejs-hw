import { Router } from "express";
import { getStudentById, getStudents } from "../controllers/studentsController.js";

const router = Router();

router.get('/students', getStudents);

// GET /students/:studentId — один студент за id
router.get('/students/:studentId', getStudentById);

export default router;
