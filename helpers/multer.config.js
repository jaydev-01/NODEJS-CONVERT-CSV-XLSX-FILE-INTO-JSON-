// pakage import
const multer = require('multer');
const md5 = require('md5');
// path and fs are included in express pakage
const path = require('path')
const fs = require('fs')

/*
 storage is function which will store file in given destination path
 and add filename with that file
*/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, md5(Date.now()) + path.extname(file.originalname));
    }
})

// function to upload CSV file its only allowed csv file to upload
const uploadCSVFile = multer({
    storage: storage,
    //using fileFilter perameter you can easily filter file formate and using that 
    //you can allowed specific file to upload
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "text/csv") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only CSV or text file formate alloed!'))
        }
    }
});

// this function will upload XLS file and its only allowed xls file
//to upload
const uploadXLSXFile = multer({
    storage: storage,
    //using fileFilter perameter you can easily filter file formate and using that 
    //you can allowed specific file to upload
    fileFilter: (req, file, cb) => {
        let extName = path.extname(file.originalname);
        if (extName === ".xls" || extName === ".xlsx") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only xlsx or xls file formate alloed!'))
        }
    }
});

// function to delete particular file
const delteFile = (filepath) => {
    fs.unlinkSync(filepath, (err) => {
        if (err) return err.message;
        return 1;
    });
};

// export all above function which we will use in others files
module.exports = {
    uploadCSVFile,
    uploadXLSXFile,
    delteFile
}