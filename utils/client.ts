import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export const initRedisClient = async () => {
    if (!client) {
        client = createClient();
        client.on("error", (err) => {
            console.error("Error while connecting to redis client!", err);
        });
        client.on("connect", () => {
            console.log("Redis connected!")
        })

        await client.connect();
    }

    return client;
}