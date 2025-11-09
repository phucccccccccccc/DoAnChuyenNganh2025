var express = require('express');
var router = express.Router();

// 🏠 Trang chính admin
router.get('/', function(req, res, next) {
    res.render('admin/index', {layout: 'admin/index'});


});
// 🔐 Trang đăng nhập admin

    router.get('/login', function (req, res) {
        res.render('admin/login', {layout: 'admin/login'});
    });

    module.exports = router;

