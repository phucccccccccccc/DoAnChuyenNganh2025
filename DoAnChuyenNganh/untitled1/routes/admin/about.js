const express = require('express');
const router = express.Router();
const About = require('../../models/About');

// GET ABOUT
router.get('/', async (req, res) => {
    let about = await About.findOne().lean();

    if (!about) {
        about = await About.create({
            title: 'About Us',
            description: '',
            features: [],
            mission: '',
            vision: '',
            image: ''
        });
    }

    res.render('admin/about', {
        layout: 'layouts/admin',
        title: 'Quản lý About',
        about
    });
});

// UPDATE ABOUT
router.post('/update', async (req, res) => {
    const {
        title,
        description,
        image,
        mission,
        vision,
        feature_icon,
        feature_title,
        feature_description
    } = req.body;

    const titles = Array.isArray(feature_title) ? feature_title : [feature_title];
    const icons = Array.isArray(feature_icon) ? feature_icon : [feature_icon];
    const descriptions = Array.isArray(feature_description)
        ? feature_description
        : [feature_description];

    const features = titles
        .map((t, i) => ({
            icon: icons[i] || '',
            title: t || '',
            description: descriptions[i] || ''
        }))
        .filter(f => f.title);

    await About.findOneAndUpdate(
        {},
        { title, description, image, mission, vision, features },
        { upsert: true }
    );

    res.redirect('/admin/about');
});

module.exports = router;
