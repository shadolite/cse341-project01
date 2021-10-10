const ObjectID = require('mongodb').ObjectID;
const getDB = require('./database').getDB;
const productsCollection = 'products';

const insertProduct = (product) => {
  const db = getDB();
  return db.collection(productsCollection)
    .insertOne(product)
    .then(result => {
      console.log(result);
    })
    .catch(error => console.log(error));
}

const updateProduct = (product) => {
  const db = getDB();
  return db.collection(productsCollection)
    .updateOne({ _id: product._id }, { $set: product })
    .then(result => {
      console.log(result);
    })
    .catch(error => console.log(error));
}

const getProducts = () => {
  const db = getDB();
  return db
    .collection(productsCollection)
    .find()
    .toArray()
    .then(products => {
      return products;
    })
    .catch(error => console.log(error));
}

const getProductsFromIDs = (productIDs) => {
  const db = getDB();
  return db
    .collection(productsCollection)
    .find({ _id: { $in: productIDs } })
    .toArray()
    .then(products => {
      return products;
    })
    .catch(error => console.log(error));
}

const getProduct = (productID) => {
  const db = getDB();
  return db
    .collection(productsCollection)
    .find({ _id: new ObjectID(productID) })
    .next()
    .then(product => {
      console.log(product);
      return product;
    })
    .catch(error => console.log(error));
}

const deleteProduct = (productID) => {
  const db = getDB();
  return db
    .collection(productsCollection)
    .deleteOne({ _id: new ObjectID(productID) })
    .then(result => {
      console.log('Deleted');
    })
    .catch(error => console.log(error));
}

exports.insertProduct = insertProduct;
exports.updateProduct = updateProduct;
exports.getProducts = getProducts;
exports.getProductsFromIDs = getProductsFromIDs;
exports.getProduct = getProduct;
exports.deleteProduct = deleteProduct;