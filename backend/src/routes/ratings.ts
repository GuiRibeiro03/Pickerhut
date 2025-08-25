import { Router } from "express";
import {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deleteRating
} from "../controllers/ratingController";

const router = Router();

router.get('/', getAllRatings);
router.post('/', createRating);
router.get('/:id', getRatingById);
router.patch('/:id', updateRating);
router.delete('/:id', deleteRating);

export default router;
