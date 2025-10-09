import { initRedisClient } from "../utils/client.js";
import { successResponse } from "../utils/responses.js";
import { cuisineKey, cuisinesKey, restaurantKeyById } from "../utils/keys.js";
import express, { type Request, type Response, type NextFunction } from "express";

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await initRedisClient();
        const cuisines = await client.sMembers(cuisinesKey);
        return successResponse(res, 200, cuisines);
    } catch (error) {
        next(error)
    }
});

router.get('/:cuisineType', async (req: Request, res: Response, next: NextFunction) => {
    const { cuisineType } = req.params;
    try {
        const client = await initRedisClient();
        if (!cuisineType) throw new Error("Cuisine doen't exist!")
        const restaurantIds = await client.sMembers(cuisineKey(cuisineType));
        const restaurants = await Promise.all(
            restaurantIds?.map(id => client.hGet(restaurantKeyById(id), "name"))
        )
        return successResponse(res, 200, restaurants);
    } catch (error) {
        next(error)
    }
});

export default router;