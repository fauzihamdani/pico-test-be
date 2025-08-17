import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import chatRoute from "./routes";
import "dotenv/config";

const app = express();
const port = 3008;

app.use(express.json());

app.use(cors());

app.use(chatRoute);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "An error ocured" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
