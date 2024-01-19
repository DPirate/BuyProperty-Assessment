import { Schema, Types, connect, model } from "mongoose";

// TODO: move to env file
const mongo_url =
  "mongodb+srv://url-shortner-user:yJbiH7VRT0K3ErOM@assignments.hgo5pis.mongodb.net/";

connect(mongo_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

interface IMongoEntity {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Url extends IMongoEntity {
  url: string;
  noOfVisits: number;
  expiry: Date;
}

export const UrlModel = model<Url>(
  "urls",
  new Schema<Url>(
    {
      url: { type: String, required: true },
      noOfVisits: { type: Number, required: true },
      expiry: { type: Date, required: true },
    },
    {
      timestamps: true,
    }
  )
);
