const ObjectID = require('mongodb').ObjectID;
const CartItem = require('./cartItem');
const Cart = require('./cart');
const usersDB = require('../util/database/users');
const productsDB = require('../util/database/products');
const ordersDB = require('../util/database/orders');

// const getAddCartItem = (cart, product) => {
//   console.log(cart.items[0]);
//   const cartProductIndex = cart.items.findIndex(item => {
//     return item.productID.toString() === product._id.toString();
//   });

//   let newQuantity = 1;
//   const updatedCartItems = [...cart.items];

//   if (cartProductIndex >= 0) {
//     newQuantity = cart.items[cartProductIndex].quantity + 1;
//     updatedCartItems[cartProductIndex].quantity = newQuantity;
//   } else {
//     updatedCartItems.push(new CartItem(product.id, newQuantity));
//   }
// }

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = id;
  }
  // constructor(username, email, cart, id) {
  //   this.name = username;
  //   this.email = email;
  //   this.cart = cart ? cart : { items: [] };
  //   this._id = id ? new ObjectID(id) : null;
  // }

  save() {
    usersDB.insertUser(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    // var updatedCartItems;
    // if (!this.cart.items || this.cart.items.length < 1) {
    //   updatedCartItems = [new CartItem(product._id, 1)];
    // } else {
    //   updatedCartItems = getAddCartItem(this.cart, product);
    // }

    // const updatedCart = {
    //   items: updatedCartItems
    // };

    return usersDB.updateUserCart(this._id, updatedCart);
  }

  getCart() {
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    // const productIDs = this.cart.items.map(item => {
    //   return item.productID;
    // });
    console.log(productIds);
    return productsDB.getProductsFromIDs(productIds)
      .then(products => {
        return products.map(p => {
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteItemFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });

    return usersDB.updateUserCart(this._id, updatedCartItems);
  }

  addOrder() {
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new ObjectID(this._id),
            name: this.name
          }
        };
        return ordersDB.insertOrder(order);
      })
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