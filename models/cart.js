const path = require('path');
const FileHelper = require('../util/fileHelper');

const cartFilepath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

const getAddUpdatedProducts = (cart, id) => {
    console.log(cart.products);
    let updatedProduct;

    if (cart.products) {
        const existingProductIndex = cart.products.findIndex(
            p => p.id === id
        );

        const existingProduct = cart.products[existingProductIndex];

        if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
        } else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct];
          }
    } else {
        console.log("adding product to cart");
        updatedProduct = { id: id, qty: 1 };
        cart.products = [ updatedProduct ];
    }

    console.log(cart);
    return cart.products;
}

const getAddUpdatedTotal = (cart, productPrice) => {
    if (!cart.totalPrice){
        cart.totalPrice = 0;
    }
    return cart.totalPrice + +productPrice;
}

const getRemoveUpdatedProducts = (cart, id) => {
    console.log(cart);
    if (cart.products)
    return cart.products.filter(prod => prod.id !== id);
}

const getRemoveUpdatedTotal = (totalPrice, productPrice, productQty) =>
    totalPrice - productPrice * productQty;

module.exports = class Cart {
    constructor(products, totalPrice) {
        this.products = products;
        this.totalPrice = totalPrice;
    }

    static addProduct(id, productPrice) {
        FileHelper.getFileContents(cartFilepath, (cart) => {
            let updatedCart = new Cart([], 0);
            updatedCart.products = getAddUpdatedProducts(cart, id);
            updatedCart.totalPrice = getAddUpdatedTotal(cart, productPrice);
            console.log(updatedCart);
            FileHelper.saveToFile(cartFilepath, updatedCart);
        });
    }

    static removeProduct(id, productPrice) {
        FileHelper.getFileContents(cartFilepath, (updatedCart) => {
            if (updatedCart === []) {
                return;
            }

            const product = updatedCart.products.find(product => product.id === id);

            if (!product) {
                return;
            }

            updatedCart.products = getRemoveUpdatedProducts(updatedCart.products, product);
            updatedCart.totalPrice = getRemoveUpdatedTotal(updatedCart.totalPrice, productPrice, product.qty);

            FileHelper.saveToFile(cartFilepath, updatedCart);
        });
    }

    static getCart(callback) {
        FileHelper.getFileContents(cartFilepath, callback);
    }
};
