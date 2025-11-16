const fs = require("fs");
const csvParser = require("csv-parser");
const ExcelJS = require("exceljs");
const Product = require("../models/Product");
const { bulkProductSchema } = require("../validators/productBulkValidators");

exports.processCSV = (filePath) =>
    new Promise((resolve, reject) => {
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on("data", (row) => rows.push(row))
            .on("end", async () => {
                try {
                    const response = await handleRows(rows);
                    resolve(response);
                } catch (err) {
                    reject(err);
                }
            })
            .on("error", reject);
    });

exports.processXLSX = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const sheet = workbook.worksheets[0];
    const rows = [];

    sheet.eachRow((row, index) => {
        if (index === 1) return; // skip header
        const [name, price, image, categoryId] = row.values.slice(1);

        rows.push({ name, price, image, categoryId });
    });

    return await handleRows(rows);
};

async function handleRows(rows) {
    const validOps = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        const { error, value } = bulkProductSchema.validate(row);

        if (error) {
            errors.push({
                row: i + 1,
                message: error.details[0].message,
            });
            continue;
        }

        validOps.push({
            updateOne: {
                filter: {
                    name: value.name,
                    categoryId: value.categoryId,
                },
                update: { $set: value },
                upsert: true,
            },
        });
    }

    if (validOps.length > 0) {
        await Product.bulkWrite(validOps, { ordered: false });
    }

    return {
        total: rows.length,
        processed: validOps.length,
        errors,
    };
}
