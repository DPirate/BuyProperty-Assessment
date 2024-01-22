"use client";

import { SyntheticEvent, useState } from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";

import styles from "./app.module.css";

//TODO: move to env
const SERVER_URL = "http://localhost:3100";
const URLS_PER_PAGE = 5;

type urlListElement = {
  shortUrl: string;
  url: string;
  noOfVisits: number;
  createdAt: Date;
  expiry: number;
};

interface UrlResponse {
  pageNumber: number;
  urls: urlListElement[];
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
/**
 * The main page of the application.
 * Allows user to enter a url to be shortened.
 * Sends the url to the server to be shortened.
 * Then displays the shortened url.
 */
export default function App() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [generateUrlError, setGenerateUrlError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setGenerateUrlError("");
    setShortenedUrl("");
    try {
      if (!url) throw new Error("Please enter a url");
      const res = await fetch(`${SERVER_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (data.error) {
        setGenerateUrlError(data.error);
      } else {
        setShortenedUrl(data);
      }
    } catch (err) {
      setGenerateUrlError((err as Error).message);
    }
  };

  // fetch list of urls from the server
  const getUrlList = async (page: number): Promise<UrlResponse | undefined> => {
    try {
      const res = await fetch(`${SERVER_URL}/api/urls?pageNumber=${page}`);
      const data = await res.json();
      if (data.error) {
        setGenerateUrlError(data.error);
      } else {
        return data;
      }
    } catch (err) {
      setGenerateUrlError((err as Error).message);
    }
  };

  const { data: { urls } = { urls: [] } } = useQuery({
    queryKey: ["fetchUrls", pageNumber],
    queryFn: () => getUrlList(pageNumber),
  });

  // Prefetch the next page of urls
  useQuery({
    queryKey: ["fetchUrls", pageNumber + 1],
    queryFn: () => {
      getUrlList(pageNumber + 1);
    },
  });

  return (
    <div className={styles.main}>
      <div className={styles.description}>
        <h1>URL Shortener</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter a url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">Shorten</button>
        </form>
        <p aria-placeholder="Enter a Url" className={styles.code}>
          {(generateUrlError && `Error: ${generateUrlError}`) ||
            (shortenedUrl && `URL: ${shortenedUrl}`) ||
            "Url will be displayed here"}
        </p>
      </div>
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              <th>Short URL</th>
              <th>Original URL</th>
              <th>Created On</th>
              <th>Expiry(in ms)</th>
              <th>Number of Visits</th>
            </tr>
          </thead>
          <tbody>
            {urls?.map(
              ({
                shortUrl,
                createdAt,
                expiry,
                noOfVisits,
                url,
              }: urlListElement) => (
                <tr key={shortUrl}>
                  <td>{shortUrl}</td>
                  <td>{url}</td>
                  <td>{createdAt.toString()}</td>
                  <td>{expiry}</td>
                  <td>{noOfVisits}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
        <div className={styles.nav}>
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Prev
          </button>
          <button
            disabled={urls.length < URLS_PER_PAGE}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
