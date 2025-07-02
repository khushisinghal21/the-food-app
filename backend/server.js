import express from "express";
import cors from "cors";
import 'dotenv/config';
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import userrouter from "./routes/user.routes.js";
import Itemrouter from "./routes/item.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from './routes/order.routes.js'
import Item from "./models/item.models.js";
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";



// Connect to DB
connectDB();

const app = express();
const port = process.env.PORT || 5000;
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares

app.use(cors({
   origin: ["http://localhost:3000", "http://localhost:3001"], // allow both frontend ports
   credentials: true
}));
app.use(cookieParser());


app.get('/favicon.ico', (req, res) => res.status(204)); // No Content

// (Optional but helpful for debugging)

// Static upload path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userrouter);
app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
app.use("/api/items", Itemrouter);
app.use('/api/cart', cartRouter);

app.use('/api/orders',orderRouter)
app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


