import { NextFunction, Response } from "express";
import prisma from "./prismaClient";
import { PokeRequest } from "./types/pokeRequest";

async function verifyToken(
  req: PokeRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.header("X-API-KEY");

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const user = await prisma.user.findFirst({ where: { accessUuid: token } });

    if (!user) {
      return res.status(401).json({ error: "Access denied" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default verifyToken;
