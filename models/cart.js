const path = require('path');
const FileHelper = require('../util/fileHelper');

const cartFilepath = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

const getAddUpdatedProducts = (products, id) => {
    const existingProductIndex = products.findIndex(
        product => product.id === id
    );

    const existingProduct = products[existingProductIndex];
    let updatedProduct;

    if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        products = [...products];
        products[existingProductIndex] = updatedProduct;
    } else {
        updatedProduct = { id: id, qty: 1 };
        return [...products, updatedProduct];
    }

    return products;
}

const getAddUpdatedTotal = (totalPrice, productPrice) =>
    totalPrice + +productPrice;

const getRemoveUpdatedProducts = (products, id) => 
    products.filter(prod => prod.id !== id);

const getRemoveUpdatedTotal = (totalPrice, productPrice, productQty) =>
    totalPrice - productPrice * productQty;

module.exports = class Cart {
    static addProduct(id, productPrice) {
        FileHelper.getFileContents(cartFilepath, (cart) => {
            if (cart === []){
                cart.products = [];
                cart.totalPrice = 0;
            }

            cart.products = getAddUpdatedProducts(cart.products, id);
            cart.totalPrice = getAddUpdatedTotal(cart.totalPrice, productPrice);
            FileHelper.saveToFile(cartFilepath, cart);
        });
    }

    static removeProduct(id, productPrice) {
        FileHelper.getFileContents(cartFilepath, (updatedCart) => {
            if(updatedCart === []){
                return;
            }
            
            const product = updatedCart.products.find(product => product.id === id);
            
            if (!product) {
                return;
            }

            updatedCart.products = getRemoveUpdatedProducts(cart.products, product);
            updatedCart.totalPrice = getRemoveUpdatedTotal(updatedCart.totalPrice, productPrice, product.Qty);

            FileHelper.saveToFile(cartFilepath, updatedCart);
        });
    }

    static getCart(callback) {
        FileHelper.getFileContents(cartFilepath, callback);
    }
};
