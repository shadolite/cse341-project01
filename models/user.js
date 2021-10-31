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
        productID: {
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
    return cp.productID.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productID: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productD) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productID.toString() !== productID.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email })
    .catch(error => console.log(error));
};   

userSchema.statics.tryAuthenticate = function (email, password) {
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
    });
};

userSchema.statics.createUser = function (email, password) {
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new this({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save(user);
        })
    }

module.exports = mongoose.model('User', userSchema);