import Item from "../models/item.models.js";

export const createItem = async (req, res) => {
  try {
    const { name, description, category, price, rating, hearts } = req.body;
    
    // file saved by multer
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const total = Number(price) * 1;

    const newItem = new Item({
      name,
      description,
      category,
      price,
      rating,
      hearts,
      total,
      image,
    });

    const savedItem = await newItem.save();

    res.status(201).json({
      success: true,
      message: "Item created successfully",
      data: savedItem,
    });
  } catch (e) {
    if (e.code === 11000) {
      res.status(409).json({
        success: false,
        message: "Item already exists",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to create item",
        error: e.message,
      });
    }
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    const host = `${req.protocol}://${req.get("host")}`;

    const fullItems = items.map((i) => ({
      ...i.toObject(),
      image: i.image ? `${host}${i.image}` : null,
    }));

    res.status(200).json({
      success: true,
      data: fullItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};
export const deleteItem = async (req, res) => {
  try {
    const removed = await Item.findByIdAndDelete(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};
