const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
});

const fileFilter = (req, file, cb) => {
  const allowed = [".csv", ".xlsx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowed.includes(ext)) {
    return cb(new Error("Only .csv or .xlsx files allowed"), false);
  }

  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
