const express = require("express");
const Products = require("./products.model");
const Reviews = require("../reviews/reviews.model");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();


// post a products
router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });

    const savedProduct = await newProduct.save();
    // calculate reviews
    const reviews = await Reviews.find({ productId: savedProduct.id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save();
    }
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log("Error in creating product", error);
    res.status(500).json({ message: "Failed to create a new product" });
  }
});

// gat all products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      color,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (color && color !== "all") {
      filter.color = color;
    }
    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).json({ products, totalPages, totalProducts });
  } catch (error) {
    console.log("Error in getting products", error);
    res.status(500).json({ message: "Failed to get products" });
  }
});

// get a single product
router.get("/:id", async (req, res) => {
  try {
        const productId = req.params.id;
        const product = await Products.findById(productId).populate(
        "author",
        "email username"
        );
        if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const reviews = await Reviews.find({ productId }).populate("userId", "username email");
        res.status(200).json({ product, reviews });
    } catch (error) {
        console.log("Error in getting product", error);
        res.status(500).json({ message: "Failed to get product" });
    }
});

// update a product
router.patch("/update-products/:id", verifyToken, verifyAdmin,async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );
    // calculate reviews
    // const reviews = await Reviews.find({ productId: updatedProduct.id });
    // if (reviews.length > 0) {
    //   const totalRating = reviews.reduce(
    //     (acc, review) => acc + review.rating,
    //     0
    //   );
    //   const averageRating = totalRating / reviews.length;
    //   updatedProduct.rating = averageRating;
    //   await updatedProduct.save();
    // }
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log("Error in updating product", error);
    res.status(500).json({ message: "Failed to update product" });
  }
});

// delete a product
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await Products.findByIdAndDelete(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // delete reviews related to the product
    await Reviews.deleteMany({ productId });

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.log("Error in deleting product", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// get related products
router.get("/related/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter((word) => word.length > 1)
        .join("|"), "i");
    const relatedProducts = await Products.find({
      id: { $ne: productId },
      $or: [
        { name: { $regex: titleRegex } },
        { category: product.category },
      ],
    });
    res.status(200).send(relatedProducts);
  } catch (error) {
    console.log("Error in getting related products", error);
    res.status(500).json({ message: "Failed to get related products" });
  }
});



module.exports = router;
