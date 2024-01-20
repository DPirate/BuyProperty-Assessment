import express, { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { errorHandler } from "./middlewares/error-handler.js";
import { generateUrl } from "./features/generateShortUrl.js";

const app = express();
// TODO: move to env file
const port = 3000;
export const BASE_URL = "http://localhost:3000";
export const URL_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000;

app.use(express.json());

app.post(
  "/api/generate",
  asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) throw new Error("ValidationError");
    const response = await generateUrl(url);
    res.send(response);
  })
);

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new Error("RouteError"))
);

app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
