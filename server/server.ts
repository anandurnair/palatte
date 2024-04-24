import express from "express";
const cors = require("cors");
import userRouter from "./src/routes/userRoutes";
import dbConnect from "./src/config/db";
const app: express.Application = express();
import bodyParser from 'body-parser'
const PORT = 4000;
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter);

app.listen(PORT, () => {
  dbConnect();
  console.log(`running on port ${PORT}`);
});
