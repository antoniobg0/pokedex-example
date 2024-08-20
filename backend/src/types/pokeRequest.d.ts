import { Request, Response } from "express";
import User from "./user";

type PokeRequest = Application<Record<string, any>> & {
  user: User;
};
