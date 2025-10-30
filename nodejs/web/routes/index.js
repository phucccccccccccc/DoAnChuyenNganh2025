var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Trang cửa hàng */
router.get('/shop', function(req, res, next) {
    res.render('shop', { title: 'Shop Page' });
});
router.get('/single', function(req, res, next) {
    res.render('single', { title: 'Chi tiết sản phẩm' });
});

module.exports = router;
