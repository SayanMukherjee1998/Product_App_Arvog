const bulkService = require("../services/bulkUploadService");
const path = require("path");

exports.bulkUpload = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "File required" });

    const filePath = path.resolve(req.file.path);
    let result;

    if (req.file.originalname.endsWith(".csv")) {
      result = await bulkService.processCSV(filePath);
    } else {
      result = await bulkService.processXLSX(filePath);
    }

    res.json({
      success: true,
      message: "Bulk upload completed",
      ...result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
