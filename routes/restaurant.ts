import { nanoid } from "nanoid";
import { restaurantKeyById, reviewDetailsKeyById, reviewKeyById } from "../utils/keys.js";
import { initRedisClient } from "../utils/client.js";
import { validate } from "../middlewares/validate.js";
import { errorResponse, successResponse } from "../utils/responses.js";
import { RestaurantSchema, type Restaurant } from "../schemas/restaurant.js";
import express, { type Request, type Response, type NextFunction } from "express";
import { checkRestaureantExists } from "../middlewares/checkRestaurantExists.js";
import { ReviewSchema, type Review } from "../schemas/reviews.js";
import { timeStamp } from "console";

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

router.post('/:restaurantId/reviews', checkRestaureantExists, validate(ReviewSchema), async (req: Request<{ restaurantId: string }>, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const data = req.body as Review;
    try {
        const client = await initRedisClient();
        const reviewId = nanoid();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const reviewData = { id: reviewId, ...data, timeStamp: Date.now(), restaurantId }
        await Promise.all([
            client.lPush(reviewKey, reviewId),
            client.hSet(reviewDetailsKey, reviewData),
        ]);
        return successResponse(res, 201, reviewData, "Review added successfully!");
    } catch (error) {
        next(error);
    }
});

router.get('/:restaurantId/reviews', checkRestaureantExists, async (req: Request<{ restaurantId: string }>, res: Response, next: NextFunction) => {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const start = ((Number(page) - 1)) * Number(limit);
    const end = start + Number(limit) - 1;
    try {
        const client = await initRedisClient();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewIds = await client.lRange(reviewKey, start, end);
        const reviews = await Promise.all(reviewIds?.map(id => client.hGetAll(reviewDetailsKeyById(id))));
        return successResponse(res, 200, reviews);
    } catch (error) {
        next(error)
    }
});

router.delete('/:restaurantId/reviews/:reviewId', checkRestaureantExists, async (req: Request<{ restaurantId: string, reviewId: string }>, res: Response, next: NextFunction) => {
    const { restaurantId, reviewId } = req.params;
    try {
        const client = await initRedisClient();
        const reviewKey = reviewKeyById(restaurantId);
        const reviewDetailsKey = reviewDetailsKeyById(reviewId);
        const [removedResult, deleteResult] = await Promise.all([
            client.lRem(reviewKey, 0, reviewId),
            client.del(reviewDetailsKey)
        ]);
        if(removedResult === 0 && deleteResult === 0){
            return errorResponse(res, 404, "Review not found!");
        }
        return successResponse(res, 200, reviewId, "Review deleted successfully!");
    } catch (error) {
        next(error);
    }
});

router.get('/:restaurantId', checkRestaureantExists, async (req: Request<{ restaurantId: string }>, res: Response, next: NextFunction) => {
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