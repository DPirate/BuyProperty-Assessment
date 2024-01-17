import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): unknown => {
  console.error(error, request?.url, request?.body);
  if (error?.message === "UrlExpiryError") {
    return response.status(410).send("URL has expired");
  }

  if (error?.message === "UrlNotFoundError") {
    return response.status(404).send("URL not found");
  }

  if (error?.message === "RouteError") {
    return response.status(400).send("Bad Request");
  }

  return response.status(501).send("Internal Server Error");
};
