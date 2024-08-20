import axios from "axios";
import { Response } from "express";
import Pokemon from "../models/pokemon";
import PokeError from "../utilities/PokeError";
import prisma from "../prismaClient";
import { PokeRequest } from "../types/pokeRequest";

const LIMIT = 20;

const getPokemonWithDetails = async (offset: number) => {
  try {
    const getPokemonDicReq = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${offset}`
    );
    const getPokemonNames: string[] = getPokemonDicReq.data.results.map(
      (item: any) => item.name
    );
    const resolveResolutionPromises: Promise<any>[] = [];

    getPokemonNames.forEach((pName) => {
      resolveResolutionPromises.push(
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pName}`).then(
          ({ data }) =>
            new Pokemon({
              id: data.id,
              name: data.name,
              sprite: data.sprites.front_default,
              types: data.types.map((t: any) => t.type.name),
            })
        )
      );
    });

    // Wait until resolve all.
    const resolvedDetailsReq = await Promise.all(resolveResolutionPromises);

    const pokemonWithDetails = resolvedDetailsReq.reduce(
      (acc, it) => acc.concat(it),
      []
    );

    // Check favorite.

    return pokemonWithDetails;
  } catch (error: any) {
    throw new PokeError("PokeError", error.message, 500);
  }
};

const favoriteCheck = async (userId: number, pokemon: Pokemon[]) => {
  const favorites = await prisma.favorite.findMany({ where: { userId } });
  const favMap = favorites
    .map((f) => f.pokemonId)
    .reduce((keys, key) => ({ ...keys, [key]: true }), {} as any);

  return pokemon.map((pk) => {
    return { ...pk, favorite: !!favMap[pk.id] };
  });
};

const searchPokemon = async (query: string | number) => {
  try {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${query}`
    );

    const pokemon = new Pokemon({
      id: data.id,
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
    });

    return [pokemon];
  } catch (_) {
    throw new PokeError("SearchError", "Pokemon not found", 404);
  }
};

const getPokemon = async (req: PokeRequest, res: Response) => {
  const userId = req.user.id;
  const offset = parseInt(req.query.offset) ?? 0;
  const search = req.query.search as string;

  try {
    if (search) {
      res.json({
        status: 200,
        data: {
          items: await favoriteCheck(userId, await searchPokemon(search)),
          offset: 0,
        },
      });
    } else {
      res.json({
        status: 200,
        data: {
          items: await favoriteCheck(
            userId,
            await getPokemonWithDetails(offset)
          ),
          offset: offset === 0 ? 20 : offset * 2,
        },
      });
    }
  } catch (error: any) {
    res.json({
      status: 500,
      error: error.message,
    });
  }
};

const addFavorite = async (req: PokeRequest, res: Response) => {
  const userId = req.user.id;
  const pokemonId = parseInt(req.params.id);

  try {
    const alreadyFavorite = await prisma.favorite.findFirst({
      where: { userId, pokemonId },
    });

    if (alreadyFavorite) {
      throw new PokeError("FavoriteError", "Pokemon already favorite", 400);
    }

    const [remotePokemon] = await searchPokemon(pokemonId);
    const pokemon = await prisma.pokemon.upsert({
      where: { id: remotePokemon.id },
      create: remotePokemon,
      update: {},
    });

    await prisma.favorite.create({
      data: {
        userId,
        pokemonId: pokemon.id,
      },
    });

    res.json({
      status: 200,
      message: "Pokemon added as favorite successfully",
    });
  } catch (error: any) {
    res.json({
      status: error.code,
      error,
    });
  }
};

const removeFavorite = async (req: PokeRequest, res: Response) => {
  const userId = req.user.id;
  const pokemonId = parseInt(req.params.id);

  try {
    const favExits = await prisma.favorite.findFirst({
      where: { userId, pokemonId },
    });

    if (!favExits) {
      throw new PokeError("FavoriteError", "Pokemon is not favorite", 400);
    }

    const fav = await prisma.favorite.findFirst({
      where: {
        userId,
        pokemonId,
      },
    });

    await prisma.favorite.delete({
      where: {
        id: fav?.id,
      },
    });

    res.json({
      status: 200,
      message: "Pokemon remove as favorite successfully",
    });
  } catch (error: any) {
    res.json({
      status: error.code,
      error,
    });
  }
};

export { getPokemon, addFavorite, removeFavorite };
