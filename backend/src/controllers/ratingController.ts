import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function getAllRatings(req: Request, res: Response) {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  try {
    const ratings = await prisma.rating.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        user_id: true,
        target_type: true,
        target_id: true,
        value: true,
        created_at: true,
      },
    });
    res.json(ratings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getRatingById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });
  try {
    const rating = await prisma.rating.findUnique({
      where: { id },
      select: {
        id: true,
        user_id: true,
        target_type: true,
        target_id: true,
        value: true,
        created_at: true,
      },
    });

    if (!rating) return res.status(404).json({ error: "Rating not found" });

    res.json(rating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createRating(req: Request, res: Response) {
  const { user_id, target_type, target_id, value } = req.body;

  if (!user_id || !target_type || !target_id || typeof value !== "number") {
    return res.status(400).json({ error: "All fields are required" });
  }
  
  if (!["movie", "series"].includes(target_type)) {
    return res
      .status(400)
      .json({ error: "target_type must be 'movie' or 'series'" });
  }
  if (value < 1 || value > 10) {
    return res
      .status(400)
      .json({ error: "Rating value must be between 1 and 10" });
  }
  try {
    const newRating = await prisma.rating.create({
      data: {
        user_id,
        target_type,
        target_id,
        value,
      },
    });
    res.status(201).json(newRating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteRating(req: Request, res: Response) {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    const deletedRating = await prisma.rating.delete({ where: { id } });
    res.json(deletedRating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateRating(req: Request, res: Response) {
  const { id } = req.params;
  const { user_id, target_type, target_id, value } = req.body;

  if (!id) return res.status(400).json({ error: "ID is required" });

  try {
    const updatedRating = await prisma.rating.update({
      where: { id },
      data: {
        user_id,
        target_type,
        target_id,
        value,
      },
    });
    res.json(updatedRating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
