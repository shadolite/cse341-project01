const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.statics.tryAuthenticate = function (email, password) {
  var hashpass = bcrypt.hash(password, 12);
  return this.findOne({ email: email })
    .then(user => {
      if (!user) { return undefined; }

      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) { return user; }
          return undefined;
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
};

userSchema.statics.createUser = function (email, password) {
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return usersDB.insertUser(user);
        })
    }

module.exports = mongoose.model('User', userSchema);

// const ObjectID = require('mongodb').ObjectID;
// const CartItem = require('./cartItem');
// const Cart = require('./cart');
// const usersDB = require('../util/database/users');
// const productsDB = require('../util/database/products');
// const ordersDB = require('../util/database/orders');
// const bcrypt = require('bcryptjs');

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     usersDB.insertUser(this);
//   }

//   addToCart(product) {
//     if (!this.cart.items) {
//       this.cart.items = [];
//     }
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.product._id.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         product: product,
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems
//     };

//     return usersDB.updateUserCart(this._id, updatedCart);
//   }

//   getCart() {
//     return usersDB.getUser().cart;
//   }

//   deleteFromCart(productID) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.product._id.toString() !== productID.toString();
//     });

//     this.cart.items = updatedCartItems;

//     return usersDB.updateUserCart(this._id, this.cart);
//   }

//   addOrder() {
//     const order = {
//       items: this.cart.items,
//       user: {
//         _id: new ObjectID(this._id),
//         name: this.name
//       }
//     }

//     return ordersDB.insertOrder(order)
//       .then(result => {
//         this.cart = { items: [] };
//         return usersDB.updateUserCart(this._id, this.cart);
//       })
//       .catch(error => console.log(error));
//   }

//   getOrders = () =>
//     ordersDB.getOrders(this._id);

//   static findByID = (userID) =>
//     usersDB.getUser(userID);

//   static findByEmail = (email) =>
//     usersDB.getUserByEmail(email);

//   static tryAuthenticate = (email, password) => {
//     usersDB.getUserByEmail(email)
//       .then(user => {
//         if (!user) { return undefined; }

//         bcrypt
//           .compare(password, user.password)
//           .then(doMatch => {
//             if (doMatch) { return user; }
//             return undefined;
//           })
//           .catch(error => console.log(error));
//       })
//       .catch(error => console.log(error));
//   }

//   static createUser = (email, password) => {
//     return bcrypt
//       .hash(password, 12)
//       .then(hashedPassword => {
//         const user = new User({
//           email: email,
//           password: hashedPassword,
//           cart: { items: [] }
//         });
//         return usersDB.insertUser(user);
//       })
//   }
// }

// module.exports = User;