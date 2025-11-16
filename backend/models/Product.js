const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProductSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: () => uuidv4(),
            index: true
        },

        name: {
            type: String,
            required: true
        },

        image: {
            type: String
        },

        price: {
            type: Number,
            required: true,
            default: 0.0
        },

        uniqueId: {
            type: String,
            unique: true,
            required: true,
            default: () => "PRD-" + uuidv4().slice(0, 8)
        },

        categoryId: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
