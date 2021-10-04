const path = require('path');
const FileHelper = require('../util/fileHelper');
const Cart = require('./cart');
const uuid = require('uuid');

const productsFilepath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

module.exports = class Product {
    constructor(id, title, description, rating, price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.price = price;
    }

    save() {
        FileHelper.getFileContents(productsFilepath, (products) => {
            if (this.id) {
                const existingProductIndex = products.findIndex(p => p.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                products = [this];
            } else {
                if (products === []){
                    products = { };
                }
                this.id = uuid.v1();
                products.push(this);
            }
            FileHelper.saveToFile(productsFilepath, products);
        });
    }

    static remove(id) {
        FileHelper.getFileContents(productsFilepath, (products) => {
            try {
                const product = products.find(p => p.id === id);
                const updatedProducts = products.filter(p => p.id === id);

                FileHelper.saveToFile(productsFilepath, updatedProducts);
                Cart.removeProduct(id, product.price);
            } catch (error) {
                console.log("Error removing product: " + error);
            }
        });
    }

    static fetchAll(callback) {
        FileHelper.getFileContents(productsFilepath, callback);
    }

    static findByID(id, callback) {
        FileHelper.getFileContents(productsFilepath, (products) => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
}