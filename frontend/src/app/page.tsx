"use client";

import { SyntheticEvent, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

//TODO: move to env
const SERVER_URL = "http://localhost:3100";
/**
 * The main page of the application.
 * Allows user to enter a url to be shortened.
 * Sends the url to the server to be shortened.
 * Then displays the shortened url.
 */
export default function Page() {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
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
        setError(data.error);
      } else {
        setShortenedUrl(data);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className={styles.container}>
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
      {error && <p className={styles.error}>{error}</p>}
      {shortenedUrl && (
        <div className={styles.shortenedUrl}>
          <p>Shortened URL:</p>
          <a href={shortenedUrl}>{shortenedUrl}</a>
        </div>
      )}
    </div>
  );
}
