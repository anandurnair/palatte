import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import { Request, Response } from "express";
import userRouter from "./src/routes/userRoutes";
import dbConnect from "./src/config/db";
import adminRouter from "./src/routes/adminRoutes";
import postRouter from "./src/routes/postRouter";
require('dotenv').config();

const app: Application = express();
const PORT: number = 4000;

app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(userRouter);
app.use(adminRouter);
app.use(postRouter)

app.listen(PORT, () => {
  dbConnect();
  console.log(`Running on port ${PORT}`);
});