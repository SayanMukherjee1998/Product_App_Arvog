const exportService = require("../services/exportService");

exports.exportProducts = async (req, res) => {
  try {
    const { format, search, categoryId, minPrice, maxPrice } = req.query;

    const filter = {};

    if (search) filter.$text = { $search: search };
    if (categoryId) filter.categoryId = categoryId;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (format === "csv") {
      return await exportService.exportProductsCSV(filter, res);
    }

    if (format === "xlsx") {
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return await exportService.exportProductsXLSX(filter, res);
    }

    res.status(400).json({ success: false, message: "Invalid format" });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
