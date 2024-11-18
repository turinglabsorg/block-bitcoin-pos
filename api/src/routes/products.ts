import * as express from "express";
import mongoose from "mongoose";
import { validateSession } from "../libs/crypto";

export async function addProduct(req: express.Request, res: express.Response) {
  const { name, price, color } = req.body;
  const user = await validateSession(req);

  if (!user) {
    return res.status(401).send({ message: "User is not authenticated.", error: true });
  }

  try {
    if (!user.products) {
      user.products = [];
    }

    if (user.products.length >= 30) {
      return res.send({ message: "You can only have up to 30 products.", error: true });
    }

    const newProduct = new mongoose.Types.ObjectId();
    const product = { _id: newProduct, name, price, color };
    user.products.push(product);
    await user.save();

    res.send({ message: "Product added successfully.", error: false, product });
  } catch (error) {
    console.error("Error adding product:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}

export async function removeProduct(req: express.Request, res: express.Response) {
  const { productId } = req.body;
  const user = await validateSession(req);

  if (!user) {
    return res.status(401).send({ message: "User is not authenticated.", error: true });
  }

  try {
    user.products = user.products.filter((product) => product._id.toString() !== productId);
    await user.save();
    res.send({ message: "Product removed successfully.", error: false });
  } catch (error) {
    res.send({ message: "Error removing product.", error: true });
  }
}

export async function getProducts(req: express.Request, res: express.Response) {
  const user = await validateSession(req);

  if (!user) {
    return res.status(401).send({ message: "User is not authenticated.", error: true });
  }

  try {
    if (!Array.isArray(user.products)) {
      console.error("Products is not an array:", user.products);
      return res.status(500).json({
        error: true,
        message: "Internal server error: products field is not an array.",
      });
    }

    res.send({ message: "Products retrieved successfully.", error: false, products: user.products });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
}
