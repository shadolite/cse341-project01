const ObjectID = require('mongodb').ObjectID;
const getDB = require('./database').getDB;
const usersCollection = 'users';

const insertUser = (user) => {
    const db = getDB();
    return db.collection(usersCollection)
        .insertOne(user)
        .then(result => {
            console.log(result);
            console.log("Inserted User");
        })
        .catch(error => console.log(error));
}

const getUser = (userID) => {
    const db = getDB();
    return db.collection(usersCollection)
        .findOne({ _id: new ObjectID(userID) })
        .then(user => {
            console.log("Retrieved User");
            return user;
        })
        .catch(error => console.log(error));
}

const updateUserCart = (userID, cart) => {
    const db = getDB();
    return db.collection(usersCollection)
        .updateOne(
            { _id: new ObjectID(userID) },
            { $set: { cart: cart } }
        )
        .then(result => {
            console.log(result);
            console.log("Updated Cart");
        })
        .catch(error => console.log(error));
}

exports.insertUser = insertUser;
exports.getUser = getUser;
exports.updateUserCart = updateUserCart;