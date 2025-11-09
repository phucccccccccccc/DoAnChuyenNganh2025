var express = require('express');
var router = express.Router();

//  Trang chính admin

//  Trang đăng nhập admin

    router.get('/login', function (req, res) {
        res.render('admin/login', {layout: 'admin/login'});
    });
router.get('/', (req, res) => {
    res.render('layouts/admin', { layout: 'layouts/admin', title: 'Bảng điều khiển' });
});


    module.exports = router;

