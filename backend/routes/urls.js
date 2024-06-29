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



router.post('/ranking', async (req, res) => {
    const { title, keyword } = req.body;

    try {
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}&crid=UUQ4CAGPONAW&sprefix=${encodeURIComponent(keyword)}%2Caps%2C200&ref=nb_sb_noss_1`;

        const response = await axios.get(searchUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
            }
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const items = $('div[data-component-type="s-search-result"]');

            let rank = -1;
            let found = false;

            items.each((index, element) => {
                const itemTitle = $(element).find('span.a-size-base-plus.a-color-base.a-text-normal').text().trim();
                console.log(`Found item title: ${itemTitle}`); // Log the title found
                if (itemTitle.includes(title)) {
                    rank = index + 1;
                    found = true;
                    return false; // Exit the each loop
                }
            });

            if (found) {
                res.status(200).json({ rank });
            } else {
                console.log('Product not found in search results'); // Log that the product was not found
                res.status(404).json({ message: 'Product not found in search results' });
            }
        } else {
            console.error(`Failed to fetch search results from Amazon: Status code ${response.status}`);
            res.status(500).json({ message: 'Failed to fetch search results from Amazon' });
        }
    } catch (error) {
        console.error('Error fetching Amazon search results:', error.message);
        res.status(500).json({ message: 'Error fetching Amazon search results' });
    }
});


module.exports = router;