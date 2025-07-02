import Order from "../models/order.models.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      items,
      paymentMethod,
      subtotal,
      tax,
      total
    } = req.body;


    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    // Enforce minimum order total for Stripe (50 INR)
    const minOrderTotal = 50;
    if (Number(total) < minOrderTotal) {
      return res.status(400).json({ message: `Minimum order amount is ₹${minOrderTotal}. Please add more items to your cart.` });
    }

    // Fetch full item details from DB to ensure image is included
    const itemIds = items.map(({ item }) => item._id || item.id).filter(Boolean);
    const dbItems = await (await import('../models/item.models.js')).default.find({ _id: { $in: itemIds } }).lean();
    const dbItemMap = {};
    dbItems.forEach(i => { dbItemMap[i._id.toString()] = i; });

    const orderItems = items.map(({ item, quantity }) => {
      const base = item || {};
      const dbItem = dbItemMap[base._id?.toString()];
      return {
        item: {
          name: base.name || dbItem?.name || "",
          price: base.price || dbItem?.price || 0
        },
        quantity: quantity || 1
      };
    });

    const shippingCost = 0;
    let newOrder;

    if (paymentMethod === 'online') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: orderItems.map(item => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.item.name,
            },
            unit_amount: item.item.price * 100
          },
          quantity: item.quantity
        })),
        customer_email: email,
        success_url: `${process.env.FRONTEND_URL}/myorder/verify?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout?payment_status=cancel`,
        metadata: { firstName, lastName, phone, email }
      });

      newOrder = new Order({
        user: req.user._id,
        email,
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
        item: orderItems,
        paymentMethod,
        shipping: shippingCost,
        paymentStatus: 'pending',
        sessionId: session.id,
        subtotal,
        tax,
        total,
        paymentIntentId: session.payment_intent
      });

      await newOrder.save();
      return res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
        session,
        checkoutUrl: session.url
      });
    }

    // For cash/card on delivery
    newOrder = new Order({
      user: req.user._id,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipCode,
      country,
      item: orderItems,
      paymentMethod,
      shipping: shippingCost,
      paymentStatus: 'processing',
      subtotal,
      tax,
      total
    });

    await newOrder.save();
    return res.status(201).json({ message: "Order created successfully", order: newOrder });

  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const updatedOrder = await Order.findOneAndUpdate(
        { sessionId: session_id },
        {
          paymentStatus: 'completed',
          paymentIntentId: session.payment_intent
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Payment confirmed", order: updatedOrder });
    } else {
      return res.status(400).json({ message: "Payment not completed" });
    }

  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
  
};


///get order

export const getOrders = async (req, res) => {
    try {
      const filter = { user: req.user._id }; // Order belongs to that particular user
      const rawOrders = await Order.find(filter).sort({ createdAt: -1 }).lean();
  
      // FORMAT
      const formatted = rawOrders.map(o => ({
        ...o,
        items: (o.item || []).map(i => ({
          _id: i._id,
          item: i.item,
          quantity: i.quantity
        })),
        createdAt: o.createdAt,
        status: o.status
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error("getOrders Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  export const getAllOrders = async (req, res) => {
    try {
      const raw = await Order.find({}).sort({ createdAt: -1 }).lean();
  
      const formatted = raw.map(o => ({
        _id: o._id,
        user: o.user,
        firstName: o.firstName || '',
        lastName: o.lastName || '',
        email: o.email || '',
        phone: o.phone || '',
        address: o.address ?? o.shippingAddress?.address ?? '',
        city: o.city ?? o.shippingAddress?.city ?? '',
        zipCode: o.zipCode ?? o.shippingAddress?.zipCode ?? '',
        createdAt: o.createdAt,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        status: o.status,
        items: (o.item || []).map(i => ({
          _id: i._id,
          item: i.item,
          quantity: i.quantity
        }))
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error("getAllOrders Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  };
  
  export const upadteAnyOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      order.status = status;
      await order.save();
  
      res.json({ message: 'Order status updated successfully' });
    } catch (error) {
      console.error('upadteAnyOrder Error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

  //get order by id
  export const getOrderbyId=async(req,res)=>{
    try{
      const order=await Order.findById(req.params.id)
      if(!order){
        return res.status(404).json({message:'order not found'})
      }

      if(!order.user.equals(req.user._id)){
        return res.status(403).json({message:'access denied'})
      }

      if(req.query.email && order.email!==req.query.email){
        return res.status(403).json({message:'access denied'})
      }
      res.json(order)

    }
    catch(error){
      console.error('get order by id',error)
      es.status(500).json({message:'server error',error:error.message})

    }
  }

 export const updateOrder=async(req,res)=>{
  try{
    const order=await Order.findById(req.params.id)
    if(!order){
      return res.status(404).json({message:'order not found'})
    }

    if(!order.user.equals(req.user._id)){
      return res.status(403).json({message:'access denied'})
    }

    if(req.body.email && order.email!==req.body.email){
      return res.status(403).json({message:'access denied'})
    }
    const updated=await Order.findByIdAndUpdate(req.params.id,
      req.body,{new:true})
      res.json(updated)

  }
  catch(error){
    console.error('get order by id',error)
    es.status(500).json({message:'server error',error:error.message})

  }

}
