const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const CategorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: () => uuidv4(),
      index: true
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
