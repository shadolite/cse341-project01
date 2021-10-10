const ObjectID = require('mongodb').ObjectID;

class CartItem {
  constructor(productID, quantity) {
    this.productID = productID ? new ObjectID(productID) : null;
    this.quantity = quantity;
  }
}

module.exports = CartItem;