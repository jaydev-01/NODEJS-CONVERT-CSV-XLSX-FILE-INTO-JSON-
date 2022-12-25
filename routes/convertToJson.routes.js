"use strict"
module.exports = app => {
    const express = require("express");
    const readFileController = require("../controller/convertToJson.controller")
    let router = express.Router();

    router.post("/read-csv-file", readFileController.ReadCsvFile);
    router.post("/read-xl-file", readFileController.ReadXlsxFile);

    app.use("/read-file", router);
}
