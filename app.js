const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error');

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();


app.set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }))
.use(express.json())
  .use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection)
  .use(flash())
  .use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/admin', adminRoutes)
  .use(shopRoutes)
  .use(authRoutes)
  .get('/500', errorController.get500)
  .use(errorController.get404)
  .use((error, req, res, next) => {
    res.status(500).render('500', {
      title: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    });
  });

// var appendLocalsToUseInViews = function (req, res, next) {
//   res.locals.request = req;

//   if (req.session != null) {
//     res.session.env = req.session.env;
//   }

//   next(null, req, res);
// };

// app.use(appendLocalsToUseInViews);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });