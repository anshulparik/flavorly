import express from "express";
import restaurantsRouter from "./routes/restaurant.js"
import cuisinesRouter from "./routes/cuisines.js"
import { errorHandler } from "./middlewares/errorHandler.js";

const PORT = process.env.PORT || 5000;
const app = express();

// middleswares
app.use(express.json());
app.use("/restaurants", restaurantsRouter)
app.use("/cuisines", cuisinesRouter)
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
}).on("error", (error) => {
    throw new Error(`Error while starting the app!  ERR: ${error?.message}`)
})