import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middlewares/error-handler.js";
const app = express();
const port = 3000;

app.use(express.json());

app.post("/generate", async (req, res) => {
  res.send("generated");
});

app.use((_req: Request, _res: Response, next: NextFunction) =>
  next(new Error("RouteError"))
);

app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
