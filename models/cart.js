const ObjectID = require('mongodb').ObjectID;
const CartItem = require('./cartItem');

class Cart {
  constructor(items){
    this.items = items;
  }

  addItem = (product) => {

  }

  deleteItem = (productID) => {

  }
}

module.exports = Cart;