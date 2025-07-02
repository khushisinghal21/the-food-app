import express from 'express';
import {
  confirmPayment,
  createOrder,
  getAllOrders,
  getOrderbyId,
  getOrders,
  upadteAnyOrder,
  updateOrder
} from '../controllers/order.controllers.js';

import { verifyJWT } from '../middleware/auth.middlewares.js';

const orderRouter = express.Router();

// Public route to get all orders (if needed, apply verifyJWT)
orderRouter.get('/getall', getAllOrders);

// Update any order status by ID (admin access preferred)
orderRouter.put('/getall/:id', upadteAnyOrder);

// Protected user routes
orderRouter.post('/', verifyJWT, createOrder);
orderRouter.get('/', verifyJWT, getOrders);
orderRouter.get('/confirm', confirmPayment);
orderRouter.get('/:id', verifyJWT, getOrderbyId);
orderRouter.put('/:id', verifyJWT, updateOrder);

export default orderRouter;
