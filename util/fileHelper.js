const fs = require('fs');

module.exports = class FileHelper {

    static hasFile = (filePath) => {
        fs.access(filePath, fs.F_OK, (err) => {
            if (err) {
                console.error(err)
                return false;
            }

            return true;
        });
    }

    static getFileContents = (filePath, callback) => {
        fs.readFile(filePath, (error, fileContent) => {
            if (error) {
                console.log("Error getting file contents: " + error);
                callback([]);
            } else {
                callback(JSON.parse(fileContent));
            }
        });
    };

    static saveToFile = (filePath, data) => {
        console.log(filePath);
        console.log(data);
        let testdata = JSON.stringify(data);
        console.log(testdata);
        fs.writeFile(
            filePath,
            JSON.stringify(data),
            (error) => {
                if (error)
                console.log("Error saving file contents: " + error);
            });
    }
}