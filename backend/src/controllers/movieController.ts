import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

// Get all movies (with optional pagination)
export async function getAllMovies(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const movies = await prisma.movies.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        realease_year: true,
        poster_url: true,
        is_featured: true,
        duration: true,
        created_at: true,
        age_rating_id: true,
      },
    });
    res.json(movies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Get movie by ID
export async function getMovieById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    const movie = await prisma.movies.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        realease_year: true,
        poster_url: true,
        is_featured: true,
        duration: true,
        created_at: true,
        age_rating_id: true,
      },
    });
    if (!movie) return res.status(404).json({ error: "Movie not found" });
    res.json(movie);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Function Get movie Cast

// Create movie
export async function createMovie(req: Request, res: Response) {
  const { title, description, realease_year, poster_url, is_featured, duration, age_rating_id } = req.body;

  try {
    const data: any = {
      title,
      description,
      realease_year,
      poster_url,
      is_featured,
      duration,
      age_rating_id
    };

    // if (typeof age_rating_id === "string" && age_rating_id.length > 0) {
    //   data.age_rating_id = age_rating_id;
    // }

    const movie = await prisma.movies.create({ data });
    res.status(201).json(movie);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

// Update movie
export async function updateMovie(req: Request, res: Response) {
  const { id } = req.params;
  const {
    title,
    description,
    realease_year,
    poster_url,
    is_featured,
    duration,
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
      duration,
      age_rating_id
    };


    const movie = await prisma.movies.update({
      where: { id },
      data,
    });
    res.json(movie);
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(400).json({ error: error.message });
  }
}

// Delete movie
export async function deleteMovie(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    await prisma.movies.delete({ where: { id } });
    res.json({ message: "Movie deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Movie not found" });
    }
    res.status(400).json({ error: error.message });
  }
}
