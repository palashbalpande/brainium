import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/db";
import { userRouter } from "./routes/user";
import { contentRouter } from "./routes/content";
const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);

// app.post("/api/v1/signup", (req, res) => {});

// app.post("/api/v1/signin", (req, res) => {});

// app.post("/api/v1/content", (req, res) => {});

// app.get("/api/v1/content", (req, res) => {});

// app.delete("/api/v1/content", (req, res) => {});

// app.post("/api/v1/brain/share", (req, res) => {});

// app.get("/api/v1/brain/:shareLink", (req, res) => {});

connectDB()
  .then(() => {
    console.log("Connected to MonogoDB Successfully...");
    app.listen(3000, () => {
      console.log("Server listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err.message);
  });
