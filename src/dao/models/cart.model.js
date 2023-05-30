import { Schema, model } from "mongoose";

const cartsCollection = "carts";

const cartSchema = new Schema({
  products: { type: Array, require: true },
});

export const cartModel = model(cartsCollection, cartSchema);
