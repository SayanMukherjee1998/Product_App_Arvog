const Product = require("../models/Product");

// Create product
exports.createProduct = async (data) => {
  return await Product.create(data);
};

// Get product by ID (Mongo _id)
exports.getProductById = async (id) => {
  return await Product.findById(id);
};

// Get all products (simple list)
exports.getAllProducts = async () => {
  return await Product.find({});
};

// Update product
exports.updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { new: true });
};

// Delete product
exports.deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};


exports.advancedProductList = async (query) => {
  const {
    page,
    limit,
    sort,
    search,
    categoryId,
    minPrice,
    maxPrice,
  } = query;

  const skip = (page - 1) * limit;

  // --- FILTER OBJECT ---
  const filter = {};

  // Search text
  if (search) {
    filter.$text = { $search: search };
  }

  // Category filter
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  // --- SORTING ---
  const [sortField, sortDirection] = sort.split(":");
  const sortObj = {
    [sortField]: sortDirection === "desc" ? -1 : 1,
  };

  // --- QUERY EXECUTION ---
  const products = await Product.find(filter)
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
