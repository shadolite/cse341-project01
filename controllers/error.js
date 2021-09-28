exports.get404 = (req, res, next) => {
    res.status(404).render('pages/404', { title: '404 - Page Not Found', path: req.url });
};