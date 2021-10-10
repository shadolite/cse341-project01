const ObjectID = require('mongodb').ObjectID;
const productsDB = require('../util/database/products');

class Product {
  constructor(id, title, description, rating, price, userID) {
    this._id = id ? new ObjectID(id) : null;
    this.title = title;
    this.description = description;
    this.rating = rating;
    this.price = price;
    this.userID = userID;
  }

  save() {
    if (this._id) {
      return productDB.updateProduct(this);
    } else {
      return productDB.insertProduct(this);
    }
  }

  static fetchAll = () => 
    productsDB.getProducts();

  static findByID = (productID) =>
    productsDB.getProduct(productID);

  static deleteByID = (productID) =>
    productsDB.deleteProduct(productID);
}

module.exports = Product;