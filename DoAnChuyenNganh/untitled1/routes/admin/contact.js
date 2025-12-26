const express = require('express');
const router = express.Router();
const Contact = require('../../models/Contact');

// LIST
router.get('/', async (req, res) => {
    const contacts = await Contact.find()
        .sort({ createdAt: -1 })
        .lean();

    res.render('admin/contact/index', {
        layout: 'layouts/admin',
        title: 'Contact',
        contacts
    });
});

// DELETE
router.post('/:id/delete', async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect('/admin/contact');
});

module.exports = router;
