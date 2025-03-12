const express = require('express');
const Products = require('../products/products.model');
const Reviews = require('./reviews.model');
const router = express.Router();

// post a new review
router.post("/post-review", async (req, res) => {
  try {
    const { comment, rating, productId, userId } = req.body;
    
    if (!comment || !rating || !productId || !userId) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const existingReview = await Reviews.findOne({ productId, userId });

    if (existingReview) {
      // updates reviews
      existingReview.comment = comment;
      existingReview.rating = rating;
      await existingReview.save();
    } else {
      const newReview = new Reviews({ comment, rating, productId, userId });
      await newReview.save();
    }

    // calculate the average rating
    const reviews = await Reviews.find({ productId });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      const product = await Products.findById(productId);
      if (product) {
        product.rating = averageRating;
        await product.save({ validateBeforeSave: false });
      } else {
        return res.status(404).json({
          message: "Product not found",
          reviews: reviews
        });
      }
    }
    
    res.status(201).json({ message: "Review posted successfully", Reviews: reviews });

  } catch (error) {
    console.error("Error in post-review: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
})

// total reviews count
router.get("/total-reviews", async (req, res) => {
  try {
    const totalReviews = await Reviews.countDocuments();
    res.status(200).json({ totalReviews });
  } catch (error) {
    console.error("Error in total-reviews: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get reviews by user id
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }
    const reviews = await Reviews.find({ userId }).sort({ createdAt: -1 });
    if (reviews.length === 0) {
      return res.status(404).json({ message: "Reviews not found" });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error in user-reviews: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;