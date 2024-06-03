import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import { Request, Response } from "express";
import userRouter from "./src/routes/userRoutes";
import dbConnect from "./src/config/db";
import adminRouter from "./src/routes/adminRoutes";
import postRouter from "./src/routes/postRouter";
import serviceRouter from "./src/routes/servicRoutes";
import freelanceRouter from "./src/routes/freelanceRouter";
import conversationRouter from "./src/routes/conversationRouter";
import GroupConversationModal from "./src/models/groupConversation";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as dotenv from "dotenv";
import xssClean from "xss-clean";
const mongoSanitize = require("express-mongo-sanitize");

dotenv.config();

const app: Application = express();
const PORT: number = 4000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this according to your client's origin
  },
});

app.use(xssClean());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(cors());
app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));
app.use(userRouter);
app.use(adminRouter);
app.use(postRouter);
app.use(serviceRouter);
app.use(conversationRouter);
app.use(freelanceRouter);
interface User {
  userId: string;
  socketId: string;
}

let users: User[] = [];

const addUser = (userId: string, socketId: string) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const getUser = (userId: string) => {
  return users.find((user) => user.userId === userId);
};

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

io.on("connection", (socket: Socket) => {
  console.log("User connected", users);
  socket.on("addUser", (userId: string) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Send and get message
  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, text, isGroup, groupId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          senderId,
          text,
        });
      }
    }
  );

  socket.on("like", (currentUser: any, userId: any) => {
    console.log(`${currentUser.username} liked your post`);
    let text = `${currentUser.username} liked your post`;
    console.log("user id :", userId);
    io.emit("notification", userId, text, currentUser);
  });

  socket.on("comment", (currentUser: any, userId: any) => {
    console.log(`${currentUser.username} commented on your post`);
    let text = `${currentUser.username}  commented on your  post`;
    console.log("user id :", userId);
    io.emit("notification", userId, text, currentUser);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", users);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

server.listen(PORT, () => {
  dbConnect();
  console.log(`Running on port ${PORT}`);
});
