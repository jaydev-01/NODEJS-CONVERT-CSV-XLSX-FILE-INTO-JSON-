// imports
const csv = require('node-csv');
const xlsxFile = require('read-excel-file/node');
const fs = require('fs');
csvParser = csv.createParser();
const { uploadCSVFile, uploadXLSXFile, delteFile } = require("../helpers/multer.config");


// api got read csv file and convert it into json file
exports.ReadCsvFile = async (req, res) => {

    const CSVFileUpload = uploadCSVFile.single('csvFile');

    CSVFileUpload(req, res, async (err) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.message || "Some Error occured!",
                data: null
            })
        } else if (!req.file) {
            res.status(400).send({
                success: false,
                message: "Please Select Image",
                data: null
            })
        } else {
            /*
            ----------------------------------------------------------------------------------------------
             === mapFile of csvParser function will convert csv file into array of object ===
             csvParser.mapFile(filePath, function (err, data) {
                if (err) {
                    console.log(err.message)
                }
                console.log(data);
            });

            data = [[1,2,3],[4,5,6]]
            ----------------------------------------------------------------------------------------------
            ----------------------------------------------------------------------------------------------
            === where as parseFile of csvParser function will convert csv file into array of array ===
             csvParser.parseFile(filePath, function (err, data) {
                if (err) {
                    console.log(err.message)
                }
                console.log(data);
            });
            data = [ [], [], []]
            ----------------------------------------------------------------------------------------------
            ----------------------------------------------------------------------------------------------
            === and parse of csvParser function will conver csv string into array of array ===
             csvParser.parse(csvString, function (err, data) {
                if (err) {
                    console.log(err.message)
                }
                console.log(data);
            });
            data = [{}.{},{}]
            ---------------------------------------------------------------------------------------------
            */
            let filePath = "./public/uploads/" + req.file.filename
            csvParser.mapFile(filePath, function (err, data) {
                if (err) {
                    res.status(400).send({
                        success: false,
                        message: err.message || "Some Error occured!",
                        data: null
                    })
                }
                delteFile(filePath); //it will delete file from folder

                fs.writeFile(`./public/uploads/${req.file.originalname.split('.')[0]}.json`, JSON.stringify(data), (err) => {
                    if (err) {
                        res.status(400).send({
                            success: false,
                            message: err.message || "Some Error occured!",
                            data: null
                        })
                    }
                    res.status(200).send({
                        success: true,
                        message: "CSV FILE CONVERTED TO JSON SUCCESSFULLY",
                        json_file_link: `${process.env.WEB_URL}uploads/${req.file.originalname.split('.')[0]}.json`,
                        data: data
                    })
                })

            });
        }
    })
}

exports.ReadXlsxFile = async (req, res) => {
    const FileUpload = uploadXLSXFile.single('xlsxFile');

    FileUpload(req, res, async (err) => {
        if (err) {
            res.status(400).send({
                success: false,
                message: err.message || "Some Error occured!",
                data: null
            })
        } else if (!req.file) {
            res.status(400).send({
                success: false,
                message: "Please Select Image",
                data: null
            })
        } else {
            let filePath = "./public/uploads/" + req.file.filename;

            /* with help of read-excel-file pakage you can easily read excel file but if you want 
               excel sheet data in json formate than you also need to give specific schema in which
               you want that excel data. here below i had define  one schema for excel file
             */
            let schema = {
                'First Name': {
                    type: String,
                    prop: 'first_name'
                },
                'Last Name': {
                    type: String,
                    prop: 'last_name'
                },
                'Gender': {
                    type: String,
                    prop: 'gender'
                },
                'Country': {
                    type: String,
                    prop: 'country'
                },
                'Age': {
                    type: Number,
                    prop: 'age'
                },
                'Date': {
                    type: Date,
                    prop: 'date'
                },
                'Id': {
                    type: Number,
                    prop: 'id'
                }
            }
            xlsxFile(filePath, { schema })
                .then((data) => {
                    delteFile(filePath); //it will delete file from folder
                    fs.writeFile(`./public/uploads/${req.file.originalname.split('.')[0]}.json`, JSON.stringify(data), (err) => {
                        if (err) {
                            res.status(400).send({
                                success: false,
                                message: err.message || "Some Error occured!",
                                data: null
                            })
                        }
                        res.status(200).send({
                            success: true,
                            message: "XLS FILE CONVERTED TO JSON SUCCESSFULLY",
                            data: `${process.env.WEB_URL}uploads/${req.file.originalname.split('.')[0]}.json`,
                            data: data
                        })
                    })
                }).catch((err) => {
                    res.status(400).send({
                        success: false,
                        message: err.message || "Some Error occured!",
                        data: null
                    })
                });
        }
    })
}