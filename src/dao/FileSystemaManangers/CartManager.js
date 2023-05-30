import fs from "fs";
import ProductManager from "./ProductManager.js";

export default class CartManager {
  constructor(path) {
    this.path = path;
  }

  async addCart() {
    let carts = [];
    if (fs.existsSync(this.path)) carts = await this.#getCarts();
    let newCart = {
      id: carts[carts.length - 1]?.id + 1 || 1,
      products: [],
    };
    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return { success: `The cart was created succesfully.` };
  }

  async #getCarts() {
    let response = await fs.promises.readFile(this.path, "utf-8");
    return await JSON.parse(response);
  }

  async getCart(id) {
    try {
      let carts = [];
      if (fs.existsSync(this.path)) carts = await this.#getCarts();
      let cart = carts.find((cart) => cart.id === id);
      if (!cart) throw new Error(`The cart not exist.`);
      return cart;
    } catch (error) {
      return { error: error.message };
    }
  }

  async addProductToCart(cid, pid) {
    try {
      if (await this.#checkIfProductExist(pid))
        throw new Error(`The product does not exist.`);
      let carts = [];
      if (fs.existsSync(this.path)) carts = await this.#getCarts();
      if (!carts.find((cart) => cart.id === cid))
        throw new Error(`The cart does not exist.`);
      carts.forEach((cart) => {
        if (cart.id === cid) {
          let isInCart = cart.products.find((item) => item.product === pid);
          if (isInCart) {
            cart.products.forEach((item) => {
              if (item.product === pid) item.quantity++;
              return item;
            });
          } else {
            cart.products.push({ product: pid, quantity: 1 });
          }
        }
      });
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return { success: `The product was added successfully in cart` };
    } catch (error) {
      return { error: error.message };
    }
  }

  async #checkIfProductExist(pid) {
    let productManager = new ProductManager("./products.json");
    let products = await productManager.getProducts();
    return !products.find((product) => product.id === pid);
  }
}
