import { Router } from "express";
import { createMovie, deleteMovie, getAllMovies, getMovieById, updateMovie } from "../controllers/movieController";


const router = Router();

router.get('/',getAllMovies);
router.post('/',createMovie);
router.get('/:id',getMovieById);
router.patch('/:id',updateMovie);
router.delete('/:id',deleteMovie);

export default router;