const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const mongoConnect = require('./util/database/database').mongoConnect;
const User = require('./models/user');

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

const app = express();

app
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

.use(bodyParser.urlencoded({ extended: false }))
.use(express.static(path.join(__dirname, 'public')))

.use((req, res, next) => {
  User.findByID('61625307a4f37ddc3c238f3f')
    .then(user => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch(err => console.log(err));
})

.use('/admin', adminRoutes)
.use(shopRoutes)
.use(errorController.get404);

mongoConnect(() => {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
});