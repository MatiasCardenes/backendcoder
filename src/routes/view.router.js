import { Router } from "express";
import ProductManager from "../dao/MongoDbManagers/ProductManager.js";
import MessageManager from "../dao/MongoDbManagers/MessageManager.js";

const router = Router();
const productManager = new ProductManager("./products.json");
const messageManager = new MessageManager()

router.get("/", async (request, response) => {
  const products = await productManager.getProducts();
  response.render("index", { products, title: "Products", style: "home" });
});

router.get("/realtimeproducts", async (request, response) => {
  const io = request.app.get("socketio");
  const productos = await productManager.getProducts();
  response.render("realTimeProducts", {
    title: "Real Time Products",
    style: "home",
  });
  io.on("connection", (socket) => {
    console.log("cliente conectado");
    socket.emit("products", productos);
  });
});

router.get("/chat", (request, response) => {
  response.render("chat", { style: "styles" });
});

export default router;
