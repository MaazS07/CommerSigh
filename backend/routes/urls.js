const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Url = require('../model/Url');

// Get all URLs and perform scraping
router.get('/', async (req, res) => {
    try {
        const urls = await Url.find();

        for (let urlObj of urls) {
            try {
                const response = await axios.get(urlObj.url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
                    }
                });

                if (response.status === 200) {
                    const $ = cheerio.load(response.data);

                    const title = $('#productTitle').text().trim() || 'N/A';
                    const price = $('.a-price-whole').first().text().trim() || 'N/A';
                    const rating = $('a.a-popover-trigger.a-declarative span.a-size-base.a-color-base').text().trim() || 'N/A';
                    const availability = $('.a-size-medium.a-color-success').text().trim() || 'N/A';

                    const newData = {
                        title,
                        price,
                        rating,
                        availability,
                        createdAt: new Date()
                    };

                    // Check if there's existing data and if it's different from the new data
                    if (urlObj.data.length === 0 || 
                        JSON.stringify(newData) !== JSON.stringify(urlObj.data[urlObj.data.length - 1])) {
                        
                        // If it's different, add the new data
                        urlObj.data.push(newData);
                        await urlObj.save();
                    }
                } else {
                    console.error(`Failed to fetch URL: ${urlObj.url}`);
                }
            } catch (error) {
                console.error(`Error fetching URL (${urlObj.url}):`, error.message);
                // Handle the error gracefully, such as setting default values or skipping this URL
            }
        }

        const updatedUrls = await Url.find();
        res.json(updatedUrls);
    } catch (err) {
        console.error('Error in GET /:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Add a new URL
router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const existingUrl = await Url.findOne({ url });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists' });
        }

        const newUrl = new Url({ url });
        await newUrl.save();
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