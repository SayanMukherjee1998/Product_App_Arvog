const fastCsv = require("fast-csv");
const ExcelJS = require("exceljs");
const Product = require("../models/Product");

exports.exportProductsCSV = async (filter, res) => {
  const cursor = Product.find(filter).cursor();

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=products.csv");

  const csvStream = fastCsv.format({ headers: true });
  csvStream.pipe(res);

  for await (const doc of cursor) {
    csvStream.write({
      name: doc.name,
      price: doc.price,
      image: doc.image,
      categoryId: doc.categoryId,
      uniqueId: doc.uniqueId,
      createdAt: doc.createdAt
    });
  }

  csvStream.end();
};

exports.exportProductsXLSX = async (filter, res) => {
  const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
    stream: res,
    useStyles: false,
    useSharedStrings: false,
  });

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=products.xlsx"
  );

  const sheet = workbook.addWorksheet("Products");

  sheet.addRow([
    "name",
    "price",
    "image",
    "categoryId",
    "uniqueId",
    "createdAt",
  ]).commit();

  const cursor = Product.find(filter).cursor();

  for await (const doc of cursor) {
    sheet.addRow([
      doc.name,
      doc.price,
      doc.image,
      doc.categoryId,
      doc.uniqueId,
      doc.createdAt
    ]).commit();
  }

  await workbook.commit();
};
