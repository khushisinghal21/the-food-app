import express from "express";
import multer from "multer";
import { createItem, deleteItem, getItems } from "../controllers/item.controllers.js";

const Itemrouter = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

Itemrouter.post("/", upload.single("image"), createItem);
Itemrouter.get("/", getItems);
Itemrouter.delete("/:id", deleteItem);

export default Itemrouter;
