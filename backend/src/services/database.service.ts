import { Schema, connect, model } from "mongoose";

// TODO: move to env file
const mongo_url =
  "mongodb+srv://url-shortner-user:yJbiH7VRT0K3ErOM@assignments.hgo5pis.mongodb.net/url-shortner";

connect(mongo_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

interface IMongoEntity {
  _id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Url extends IMongoEntity {
  url: string;
  noOfVisits: number; // INFO: can change to include location and timestamp of visits, noOfVisits = visits.length
  expiry: number; // lease from creation date in ms
}

export const UrlModel = model<Url>(
  "urls",
  new Schema<Url>(
    {
      url: { type: String, required: true },
      noOfVisits: { type: Number, required: true },
      expiry: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  )
);
