const ObjectID = require('mongodb').ObjectID;
const CartItem = require('./cartItem');
const Cart = require('./cart');
const usersDB = require('../util/database/users');
const productsDB = require('../util/database/products');
const ordersDB = require('../util/database/orders');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    usersDB.insertUser(this);
  }

  addToCart(product) {
    if(!this.cart.items){
      this.cart.items = [];
    }
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.product._id.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        product: product,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };

    return usersDB.updateUserCart(this._id, updatedCart);
  }

  getCart() {
    return usersDB.getUser().cart;
  }

  deleteItemFromCart(productID) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.product._id.toString() !== productID.toString();
    });

    this.cart.items = updatedCartItems;

    return usersDB.updateUserCart(this._id, this.cart);
  }

  addOrder() {
    const order = {
      items: this.cart.items,
      user: {
        _id: new ObjectID(this._id),
        name: this.name
      }
    }

    return ordersDB.insertOrder(order)
      .then(result => {
        this.cart = { items: [] };
        return usersDB.updateUserCart(this._id, this.cart);
      });
  }

  getOrders = () =>
    ordersDB.getOrders(this._id);

  static findByID = (userID) =>
    usersDB.getUser(userID);
}

module.exports = User;