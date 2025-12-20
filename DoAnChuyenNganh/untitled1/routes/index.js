const express = require('express');
const router = express.Router();

const Category = require('../models/category');
const Car = require('../models/car');

/**
 * HOME
 */
router.get('/', async (req, res) => {
    const categories = await Category.find({ status: true }).lean();

    res.render('home/index', {
        layout: 'layouts/home',
        title: 'Trang chủ',
        categories,
        isHome: true
    });
});

/**
 * ALL CARS
 */
router.get('/car', async (req, res) => {
    const cars = await Car.find({ status: true }).lean();
    const categories = await Category.find({ status: true }).lean();

    res.render('home/cars', {
        layout: 'layouts/home',
        title: 'Danh sách xe',
        cars,
        categories,
        isCars: true
    });
});

/**
 * CARS BY CATEGORY
 */
router.get('/car/category/:id', async (req, res) => {
    const cars = await Car.find({
        category: req.params.id,
        status: true
    }).lean();

    const categories = await Category.find({ status: true }).lean();

    res.render('home/car', {
        layout: 'layouts/home',
        title: 'Xe theo danh mục',
        cars,
        categories,
        isCars: true
    });
});

/**
 * STATIC PAGES
 */
router.get('/car-details', (req, res) => {
    res.render('home/car-details', {
        layout: 'layouts/home',
        title: 'Chi tiết xe'
    });
});

router.get('/blog', (req, res) => {
    res.render('home/blog', {
        layout: 'layouts/home',
        title: 'Blog'
    });
});


router.get('/blog-details', (req, res) => {
    res.render('home/blog-details', {
        layout: 'layouts/home',
        title: 'Blog chi tiết'
    });
});

router.get('/about', (req, res) => {
    res.render('home/about', {
        layout: 'layouts/home',
        title: 'Giới thiệu'
    });
});

router.get('/contact', (req, res) => {
    res.render('home/contact', {
        layout: 'layouts/home',
        title: 'Contact'
    });
});

router.get('/customer', (req, res) => {
    res.render('home/customer', {
        layout: 'layouts/home',
        title: 'Khách hàng'
    });
});

module.exports = router;
