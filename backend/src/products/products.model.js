const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    oldPrice: { type: Number },
    color: { type: String },
    rating: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;