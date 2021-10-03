const fs = require('fs');

module.exports = class FileHelper {

    static getFileContents = (filePath, callback) => {
        fs.readFile(filePath, (error, fileContent) => {
            if (error) {
                console.log(error);
                callback([]);
            } else {
                callback(JSON.parse(fileContent));
            }
        });
    };

    static saveToFile = (filePath, data) => {
        fs.writeFile(
            filePath,
            JSON.stringify(data),
            (error) => {
                console.log(error);
            });
    }
}