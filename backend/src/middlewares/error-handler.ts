import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): unknown => {
  // log error
  console.error(error?.stack);
  console.error(`Route: ${request?.url}`);
  console.error(request?.body);

  //return error response
  if (error?.message === "UrlExpiryError") {
    return response.status(410).send("URL has expired");
  }

  if (error?.message === "UrlNotFoundError") {
    return response.status(404).send("URL not found");
  }

  if (error?.message === "RouteError") {
    return response.status(400).send("Bad Request");
  }

  if (error?.message === "ValidationError") {
    return response.status(400).send("Bad Request");
  }

  return response.status(501).send("Internal Server Error");
};
