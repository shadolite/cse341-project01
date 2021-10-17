const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/login', {
    path: '/login',
    title: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('auth/signup', {
    path: '/signup',
    title: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  User.tryAuthenticate(req.body.email, req.body.password)
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');

        return res.redirect('/login');
      } else {
        req.session.isLoggedIn = true;
        req.session.user = user;

        return req.session.save(error => {
          console.log(error);
          res.redirect('/');
        });
      }
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (password !== req.body.confirmPassword) {
    req.flash('error', 'Passwords do not match.');
    next();
  } else if (User.findByEmail(email)) {
    req.flash('error', 'E-Mail exists already, please pick a different one.');
    next();
  } else {
    User.createUser(email, password)
      .then(result => {
        res.redirect('/login');
      });
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};