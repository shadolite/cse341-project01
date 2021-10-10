const ObjectID = require('mongodb').ObjectID;
const getDB = require('./database').getDB;
const ordersCollection = 'orders';

const insertOrder = (order) => {
  const db = getDB();
  return db.collection(ordersCollection).insertOne(order);
}

const getOrders = (userID) => {
  const db = getDB();
  return db
    .collection(ordersCollection)
    .find({ 'user._id': new ObjectID(userID) })
    .toArray();
}

exports.insertOrder = insertOrder;
exports.getOrders = getOrders;