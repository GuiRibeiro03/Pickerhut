import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();



// Get all series
export async function getAllSeries(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const series = await prisma.series.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        realease_year: true,
        poster_url: true,
        is_featured: true,
        season: true,
        age_rating_id: true,
        created_at: true,
      },
    });
    res.json(series);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Series not found" });
    }
    res.status(400).json({ error: error.message });
  }
}


// Get series by ID
export async function getSeriesById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });


  try {
    const series = await prisma.series.findUnique({
      where: { id},
      select: {
        id: true,
        title: true,
        description: true,
        realease_year: true,
        poster_url: true,
        is_featured: true,
        season: true,
        age_rating_id: true,
        created_at: true,
      },
    });

    if (!series) {
      return res.status(404).json({ error: "Series not found" });
    }

    res.json(series);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Series not found" });
    }
    res.status(400).json({ error: error.message });
  }
}



// Create Series
export async function createSeries(req: Request, res: Response) {
  const { title, description, realease_year, poster_url, is_featured, age_rating_id } = req.body;

  try {
    const newSeries = await prisma.series.create({
      data: {
        title,
        description,
        realease_year,
        poster_url,
        is_featured,        
        age_rating_id,
      },
    });
    res.status(201).json(newSeries);
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Series already exists" });
    }
    res.status(400).json({ error: error.message });
  }
}


// Update Series
export async function updateSeries(req: Request, res: Response) {
  const { id } = req.params;
  const {
    title,
    description,
    realease_year,
    poster_url,
    is_featured,
    age_rating_id,
  } = req.body;

  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    const data: any = {
      title,
      description,
      realease_year,
      poster_url,
      is_featured,
      age_rating_id
    };


    const series = await prisma.series.update({
      where: { id },
      data,
    });
    res.json(series);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Series not found" });
    }
    res.status(400).json({ error: error.message });
  }
}

// Delete Series

export async function deleteSeries(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    await prisma.series.delete({ where: { id } });
    res.json({ message: "Series deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Series not found" });
    }
    res.status(400).json({ error: error.message });
  }
}
