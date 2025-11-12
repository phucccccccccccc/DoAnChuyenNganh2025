var express = require('express');
var router = express.Router();

//  Trang chính admin

//  Trang đăng nhập admin

    router.get('/login', function (req, res) {
        res.render('admin/login', {layout: 'admin/login'});
    });
router.get('/', (req, res) => {
    res.render('admin/index', { layout: 'layouts/admin', title: 'Bảng điều khiển' });
});
router.get('/register', function (req, res) {
    res.render('admin/register', {layout:    'admin/register'});
});
router.get('/forgot-password', function (req, res) {
    res.render('admin/forgot-password', {layout: 'admin/forgot-password'});
});
router.get('/category', (req, res) => {
    res.render('admin/category/category-list', { layout: 'layouts/admin', title: 'Quản lý danh mục' });
});

// Trang product
router.get('/product', (req, res) => {
    res.render('admin/product/product-list', { layout: 'layouts/admin', title: 'Quản lý sản phẩm' });
});

    module.exports = router;

