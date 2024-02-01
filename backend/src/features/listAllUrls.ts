import { BASE_URL } from "../app.js";
import { UrlModel } from "../services/database.service.js";

const URLS_PAGE_SIZE = 5;
interface UrlResponse {
  pageNumber: number;
  urls: {
    shortUrl: string;
    url: string;
    noOfVisits: number;
    createdAt: Date;
    expiry: string;
  }[];
}

/**
 * Fetches all urls from the database and then
 * maps them to an array of objects containing
 * the shortened url, the original url and the number of visits
 */
export const listAllUrls = async (pageNumber: number): Promise<UrlResponse> => {
  const urls = await UrlModel.find({})
    .sort({ createdAt: "desc" })
    .skip((pageNumber - 1) * (URLS_PAGE_SIZE - 1))
    .limit(URLS_PAGE_SIZE)
    .exec();

  return {
    pageNumber: pageNumber + 1,
    urls: urls.map(({ _id, url, noOfVisits, expiry, createdAt }) => {
      let msLeft = createdAt.getTime() + expiry - Date.now();
      if (msLeft < 0) {
        msLeft = 0;
      }
      return {
        shortUrl: `${BASE_URL}/u/${Buffer.from(_id.toString(), "hex").toString(
          "base64url"
        )}`,
        url,
        noOfVisits,
        createdAt,
        expiry: `${Math.floor(msLeft / 1000 / 60 / 60)}h ${
          Math.floor(msLeft / 1000 / 60) % 60
        }m left`,
      };
    }),
  };
};
