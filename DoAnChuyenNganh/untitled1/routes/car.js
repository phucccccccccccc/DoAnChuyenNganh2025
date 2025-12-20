const express = require('express');
const router = express.Router();

const Product = require('../models/product');   // ✅ ĐÚNG
const Category = require('../models/category'); // ✅ ĐÚNG

// ALL CARS
router.get('/', async (req, res) => {
    const cars = await Product.find({ status: true }).lean();
    const categories = await Category.find({ status: true }).lean();

    res.render('home/car', {
        layout: 'layouts/home',
        title: 'Danh sách xe',
        cars,
        categories,
        isCars: true
    });
});


// CARS BY CATEGORY
router.get('/category/:id', async (req, res) => {
    const cars = await
        Product.find({
        category: req.params.id,
        status: true
    }).lean();

    const categories = await Category.find({ status: true }).lean();


    res.render('home/car', {
        layout: 'layouts/home',
        title: 'Danh sách xe',
        cars,
        categories,
        isCars: true
    });
});

module.exports = router;
