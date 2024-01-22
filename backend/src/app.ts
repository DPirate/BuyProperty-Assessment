import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import asyncHandler from "express-async-handler"; // TODO: replace with a custom wrapper

import { errorHandler } from "./middlewares/error-handler.js";
import { generateUrl } from "./features/generateShortUrl.js";
import { listAllUrls } from "./features/listAllUrls.js";
import { fetchOriginalUrl } from "./features/fetchOriginalUrl.js";

// TODO: move to env file
const PORT = 3100;
export const BASE_URL = `http://localhost:${PORT}`;
export const URL_EXPIRY_TIME_MS = 24 * 60 * 60 * 1000;

const app = express();

app.use(cors());
app.options("*", [cors()]);
app.use(express.json());

app.post(
  "/api/generate",
  asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) throw new Error("ValidationError");
    const response = await generateUrl(url);
    res.json(response);
  })
);

// get request to fetch all urls
app.get(
  "/api/urls",
  asyncHandler(async (req, res) => {
    const pageNumber = Number(req?.query?.pageNumber ?? 0);
    if (pageNumber <= 0) throw new Error("ValidationError");
    const response = await listAllUrls(pageNumber);
    res.json(response);
  })
);

// get request to redirect to original url
app.get(
  "/u/:id",
  asyncHandler(async (req, res) => {
    const url = await fetchOriginalUrl(req.params.id);
    res.redirect(302, url);
  })
);

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new Error("RouteError"))
);

app.use(errorHandler);

app.listen(PORT, () => {
  return console.log(`Express is listening at http://localhost:${PORT}`);
});
