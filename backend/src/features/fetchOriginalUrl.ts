import { Types } from "mongoose";
import { UrlModel } from "../services/database.service.js";

/**
 * Converts url id to base 16 and then uses that id to fetch
 * url object from the database
 * @param {string} urlId - The id of the url to fetch
 * @return {Promise<string>} The url object from the database
 */
export const fetchOriginalUrl = async (urlId: string): Promise<string> => {
  // Convert the url id to base 16
  const idInBase16 = Buffer.from(urlId, "base64url").toString("hex");

  // Fetch the url object from the database using the base 16 id
  const urlObject = await UrlModel.findById(new Types.ObjectId(idInBase16));

  if (!urlObject) {
    throw new Error("UrlNotFoundError");
  }

  if (urlObject?.createdAt.getTime() + urlObject?.expiry < Date.now()) {
    throw new Error("UrlExpiredError");
  }

  return urlObject?.url;
};
