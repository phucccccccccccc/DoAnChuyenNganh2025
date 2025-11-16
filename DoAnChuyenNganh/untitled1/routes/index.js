var express = require('express');
var router = express.Router();


/* GET home page. */
 // layout admin.hbs

    router.get('/', function(req, res, next) {
      res.render('home/index', { title: 'Express' });
    });
router.get('/car', function(req, res, next) {
    res.render('home/car', { title: 'Express' });
});
router.get('/car-details', function(req, res, next) {
    res.render('home/car-details', { title: 'Express' });
});
router.get('/blog', function(req, res, next) {
    res.render('home/blog', { title: 'Express' });
});
router.get('/blog-details', function(req, res, next) {
    res.render('home/blog-details', { title: 'Express' });
});
router.get('/car-details', function(req, res, next) {
    res.render('home/car-details', { title: 'Express' });
});
router.get('/about', function(req, res, next) {
    res.render('home/about', { title: 'Express' });
});
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Express' });
});
router.get('/customer', function(req, res, next) {
    res.render('home/customer', { title: 'Express' });
});


module.exports = router;
