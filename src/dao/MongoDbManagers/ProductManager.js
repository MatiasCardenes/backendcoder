import { productModel } from "../models/product.model.js";

export default class ProductManager {
  
  async addProduct(product) {
    try {
      if (this.#checkMandatoryFields(product))
        throw new Error(`All the fields are mandatory.`);
      if (await this.#checkIfCodeExists(product.code))
        throw new Error(`The product code already exists.`);
      let result = await productModel.create(product);
      return {
        success: `The product was successfully added.`,
        payload: result,
      };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async getProducts(limit = false) {
    let products = await productModel.find({}, { __v: 0 }).lean();
    return limit === false ? products : products.splice(0, limit);
  }

  async getProductById(id) {
    try {
      let product = await productModel.findOne({ _id: id });
      if (!product) throw new Error(`Product not found`);
      return product;
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async updateProduct(id, newParams) {
    try {
      if (this.#checkIfEmptyField(newParams))
        throw new Error(`All the fields are mandatory.`);
      let result = await productModel.updateOne({ _id: id }, newParams);
      return { success: `The product was update succefully`, payload: result };
    } catch (error) {
      return { error: error.message };
    }
  }

  async deleteProduct(id) {
    try {
      let result = await productModel.deleteOne({ _id: id });
      return {
        success: `The product was successfully removed`,
        payload: result,
      };
    } catch (error) {
      return { error: `${error.message}` };
    }
  }

  async #checkIfCodeExists(code) {
    let exists = await productModel.findOne({ code: code });
    return exists
  }

  #checkMandatoryFields(fields) {
    if (Object.keys(fields).length !== 8) return true;
    return this.#checkIfEmptyField(fields);
  }

  #checkIfEmptyField(fields) {
    for (const key in fields) {
      if (
        fields[key] === "" ||
        fields[key] === undefined ||
        fields[key] === null
      )
        return true;
    }
    return false;
  }
}
