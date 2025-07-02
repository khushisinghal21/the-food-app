import asyncHandler from 'express-async-handler';
import { CartItem } from '../models/cart.models.js';
import { response } from 'express';
//get cart

export const getCart = asyncHandler(async (req, res) => {
    const items = await CartItem.find({ user: req.user._id }).populate('item');
    // Return the full item object for each cart entry
    const formatted = items.map((ci) => ({
        _id: ci._id.toString(),
        item: ci.item, // full item object
        quantity: ci.quantity,
    }));

    res.json({
        success: true,
        data: formatted,
    });

})

export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity } = req.body;
  
    if (itemId === undefined || quantity === undefined) {
      return res.status(400).json({ message: "Item ID and quantity are required" });
    }
  
    let cartItem = await CartItem.findOne({ user: req.user._id, item: itemId });
  
    if (cartItem) {
      cartItem.quantity = Math.max(cartItem.quantity + quantity, 1);
  
      if (cartItem.quantity < 1) {
        await cartItem.remove();
        return res.json({ success: true, message: "Item removed from cart" });
      }
  
      await cartItem.save();
      await cartItem.populate('item');
  
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: {
          _id: cartItem._id.toString(),
          item: cartItem.item, // full item object
          quantity: cartItem.quantity,
        },
      });
    }
  
    cartItem = await CartItem.create({
      user: req.user._id,
      item: itemId,
      quantity: Math.max(quantity, 1),
    });
  
    await cartItem.populate('item');
  
    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: {
        _id: cartItem._id.toString(),
        item: cartItem.item, // full item object
        quantity: cartItem.quantity,
      },
    });
  });

//updation of cart item

export const updateCartItem = asyncHandler(async (req, res) => {


    const { quantity } = req.body;
    if (quantity === undefined) {
        return res.status(400).json({ message: "Quantity is required" });
    }

    const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = Math.max(quantity, 1);
     

    await cartItem.save();
    await cartItem.populate('item');

    res.status(201).json({
        data: {
            _id: cartItem._id.toString(),
            item: cartItem.item, // full item object
            quantity: cartItem.quantity,
        }
    })
})


//delte

export const deleteCartItem = asyncHandler(async (req, res) => {
    const cartItem = await CartItem.findOne({ _id: req.params.id, user: req.user._id });

    if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.deleteOne();

    res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
    });
})
//clear cart

export const clearCart = asyncHandler(async (req, res) => {
    await CartItem.deleteMany({ user: req.user._id });
    res.json
({
        success: true,
        message: "Cart cleared successfully",
    });
}) 