const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

const getProductsFromFile = (callback) => {
    fs.readFile(p, (error, fileContent) => {
        if (error) {
            callback([]);
        } else {
            callback(JSON.parse(fileContent));
        }
    });
};

const saveToFile = (products) => {
    fs.writeFile(
        p,
        JSON.stringify(products),
        (error) => {
            console.log(error);
        });
}

module.exports = class Product {
    constructor(title, description, rating, price) {
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            saveToFile(products);
        });
    }

    static remove(index) {
        getProductsFromFile((products) => {
            products.splice(index, 1);
            saveToFile(products);
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }
}