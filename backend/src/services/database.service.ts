import { connect } from "mongoose";
const mongo_url =
  "mongodb+srv://url-shortner-user:yJbiH7VRT0K3ErOM@assignments.hgo5pis.mongodb.net/";

connect(mongo_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));
