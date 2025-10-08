import type { Request, Response, NextFunction } from "express";
import { errorResponse } from "../utils/responses.js";
import { initRedisClient } from "../utils/client.js";
import { restaurantKeyById } from "../utils/keys.js";

export const checkRestaureantId = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    if(!restaurantId) return errorResponse(res, 400, "RestaurantId not found!");
    const client = await initRedisClient();
    const restaurantKey = restaurantKeyById(restaurantId);
    const exists = await client.exists(restaurantKey);
    if(!exists) return errorResponse(res, 404, "Restaurant not found!");
    next();
}