import { Router } from "express";
import {
  addFavorite,
  getPokemon,
  removeFavorite,
} from "../Controllers/pokemonController";

const router = Router();

router.get("/pokemon", getPokemon);
router.post("/pokemon/:id/favorite/add", addFavorite);
router.post("/pokemon/:id/favorite/remove", removeFavorite);

export default router;
