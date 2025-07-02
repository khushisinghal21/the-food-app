import express from "express";
import { verifyJWT } from "../middleware/auth.middlewares.js";

import { getCart, addToCart, updateCartItem, deleteCartItem, clearCart } from "../controllers/cart.controllers.js";

const cartRouter = express.Router();

cartRouter.route("/")
    .get(verifyJWT, getCart)
    .post(verifyJWT, addToCart);

// Use DELETE for clearCart and place before /:id to avoid route conflicts
cartRouter.delete("/clear", verifyJWT, clearCart);

cartRouter.route('/:id')
    .put(verifyJWT, updateCartItem)
    .delete(verifyJWT, deleteCartItem);



export default cartRouter;