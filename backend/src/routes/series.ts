import {Router} from 'express';
import {getAllSeries,getSeriesById,createSeries,updateSeries,deleteSeries} from '../controllers/serieController';

const router = Router();

router.get("/", getAllSeries);
router.post("/", createSeries);
router.get("/:id", getSeriesById);
router.patch("/:id", updateSeries);
router.delete("/:id", deleteSeries);

export default router;