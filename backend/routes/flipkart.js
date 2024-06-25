const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const FlipkartUrl = require('../model/FlipkartURL');

// Get all Flipkart URLs and perform scraping
router.get('/', async (req, res) => {
    try {
        const urls = await FlipkartUrl.find();

        // Perform scraping for each URL
        for (let urlObj of urls) {
            const response = await axios.get(urlObj.url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
                }
            });

            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                const title = $('span.VU-ZEz').text().trim() || 'N/A';
                const price = $('div.Nx9bqj.CxhGGd').text().trim() || 'N/A';
                const rating = $('span').filter(function() {
                    return $(this).text().includes('Ratings');
                }).text().trim() || 'N/A';
                const availability = $('div.Z8JjpR').text().trim() || 'In Stock';

                // Prepare new scraping data
                const scrapingData = {
                    title,
                    price,
                    rating,
                    availability,
                };

                // Update URL object with new data
                urlObj.data.push(scrapingData);

                await urlObj.save();
            }
        }

        // After scraping is done, send the updated URLs to frontend
        const updatedUrls = await FlipkartUrl.find();
        res.json(updatedUrls);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new Flipkart URL
router.post('/', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const existingUrl = await FlipkartUrl.findOne({ url });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists' });
        }

        const newUrl = new FlipkartUrl({ url });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a Flipkart URL
router.delete('/:id', async (req, res) => {
    try {
        await FlipkartUrl.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted URL' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
