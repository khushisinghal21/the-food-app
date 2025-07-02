import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({

    item:{
        name: { type: String, required: true },
    price:{ type: Number, required: true,min:0 },
    imageUrl:{  type: String },

    },
    
    quantity:{ type: Number, required: true, min: 1 },

},{_id:true})



const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    phone:{
        type: String,
        required: true,
        trim: true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true
    },
    zipCode:{
        type: String,
        required: true,
        trim: true
    },
    item:[orderItemSchema],
    paymentMethod:{
        type: String,
        required: true,
        enum: ["cash", "card","online","upi", "cod"],
        index:true
    },
    paymentIntentId:{
        type: String,
        required: false,
        index: true
    },
    sessionId:{
        type: String,
        required: false,
        index: true
    },
    transactionId:{
        type: String,
        required: false,
        index: true
    },
    paymentStatus:{
        type: String,
        required: true,
        enum: ["pending", "completed", "failed", "succeeded", "processing"],
        default: "pending",
        index: true
    },
    subtotal:{
        type: Number,
        required: true,
        min: 0
    },tax:{
        type: Number,
        required: true,
        min: 0
    },
    shipping:{
        type: Number,
        required: true,
        min: 0
    },
    total:{
        type: Number,
        required: true,
        min: 0
    },
    
    status:{
        type: String,
        required: true,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "processing",
        index: true
    },
    expectedDeliveryDate:{
        type: Date,
        required: false
    },
    deliveredAt:{
        type: Date,
        required: false
    }, 

    }
    

    
,{  timestamps:true})
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// ✅ Pre-save hook to update 'updatedAt' timestamp
orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;