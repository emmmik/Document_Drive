const mongoose = require("mongoose");
const DocumentSchema = new mongoose.Schema({
    user: String,
    originalname: String,
    filename: String,
    filepath: String,
    filesize: String,
    keywords: Array
});

const document = new mongoose.model("documents", DocumentSchema);
module.exports = document;