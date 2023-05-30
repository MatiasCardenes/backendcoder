import cartRouter from "./routes/cart.router.js";
import productsRouter from "./routes/products.router.js";
import viewsRouter from "./routes/view.router.js";
import handlebars from "express-handlebars";
import express from "express";
import cors from "cors";
import { __dirname, PORT } from "./utils.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import MessageManager from "./dao/MongoDbManagers/MessageManager.js";
import "dotenv/config";

const messageManager = new MessageManager();

const app = express();
mongoose.connect(
    process.env.URL_MONGODB_ATLAS
  );

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const socketio = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
const io = new Server(socketio);
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log(`New user online...`);

  socket.on("newuser", async ({ user }) => {
    socket.broadcast.emit("newuserconnected", { user: user });
    let messages = await messageManager.getMessages();
    io.emit("messageLogs", messages);
  });

  socket.on("message", async (data) => {
    await messageManager.addMessage(data);
    let messages = await messageManager.getMessages();
    io.emit("messageLogs", messages);
  });
});
