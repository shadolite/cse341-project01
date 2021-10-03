const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

app
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')

.use(bodyParser.urlencoded({ extended: false }))
.use(express.static(path.join(__dirname, 'public')))

.use('/admin', adminRoutes)
.use(shopRoutes)
.use(errorController.get404)
.listen(PORT, () => console.log(`Listening on ${PORT}`));