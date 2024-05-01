import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import userRouter from "./src/routes/userRoutes";
import dbConnect from "./src/config/db";
import adminRouter from "./src/routes/adminRoutes";
require('dotenv').config();

const app: Application = express();
const PORT = 4000;

app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(userRouter);
app.use(adminRouter);

app.listen(PORT, () => {
  dbConnect();
  console.log(`Running on port ${PORT}`);
});
