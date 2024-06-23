const express = require('express');
const router = express.Router();
const Url = require('../model/Url');

// Get all URLs
router.get('/', async (req, res) => {
    try {
        const urls = await Url.find();
        res.json(urls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new URL
router.post('/', async (req, res) => {
    const url = new Url({
        url: req.body.url
    });

    try {
        const newUrl = await url.save();
        res.status(201).json(newUrl);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a URL
router.delete('/:id', async (req, res) => {
    try {
        await Url.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted URL' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
