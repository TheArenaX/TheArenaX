import express, { Request, Response } from "express";

const app = express();
const production = process.env.NODE_ENV === "production";

if (production) {
  app.set("trust proxy", 1);
}

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "API is running",
    uptime: Math.round(process.uptime()),
  });
});

export default app;
