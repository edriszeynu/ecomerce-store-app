import cloudinary from "../lib/cloudinary.js";
import { client } from "../lib/redis.js";
import Product from "../models/product.model.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.log("Error fetching all products:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get featured products with Redis caching
export const getFeaturedProduct = async (req, res) => {
  try {
    const cachedProducts = await client.get("featured_products");
    if (cachedProducts) {
      return res.json(JSON.parse(cachedProducts));
    }

    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await client.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProduct controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, catagory } = req.body;
    let cloudinaryResponse = null;

    if (image) {
      // Using promise instead of callback
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || null,
      catagory,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log("Error creating product:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
