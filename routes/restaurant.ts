import { nanoid } from "nanoid";
import { restaurantKeyById } from "../utils/keys.js";
import { initRedisClient } from "../utils/client.js";
import { validate } from "../middlewares/validate.js";
import { successResponse } from "../utils/responses.js";
import { RestaurantSchema, type Restaurant } from "../schemas/restaurant.js";
import express, { type Request, type Response, type NextFunction } from "express";
import { checkRestaureantId } from "../middlewares/checkRestaurantId.js";

const router = express.Router();

router.post('/', validate(RestaurantSchema), async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Restaurant;
    try {
        const client = await initRedisClient();
        const id = nanoid();
        const restaurantKey = restaurantKeyById(id);
        const hashData = { id, name: data?.name, location: data?.location };
        const addResult = await client.hSet(restaurantKey, hashData);
        console.log(`Add result: ${addResult}`);
        return successResponse(res, 201, hashData, "New restaurant added successfully!");
    } catch (error) {
        next(error);
    }
});


router.get('/:restaurantId', checkRestaureantId, async (req: Request<{ restaurantId: string }>, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    try {
        const client = await initRedisClient();
        const restaurantKey = restaurantKeyById(restaurantId);
        const [_viewCount, restaurant] = await Promise.all([
            client.hIncrBy(restaurantKey, "viewCount", 1),
            client.hGetAll(restaurantKey)
        ]);
        return successResponse(res, 200, restaurant);
    } catch (error) {
        next(error);
    }
});

export default router;