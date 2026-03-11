import express, { type Express } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "Connect Club API", health: "/api/healthz" });
});

export default app;
