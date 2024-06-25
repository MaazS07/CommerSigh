const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Url = require('../model/Url');

router.post('/', async (req, res) => {
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

          console.log(`Title: ${title}, Price: ${price}, Rating: ${rating}, Availability: ${availability}`);

          urlObj.data.push({
            title: title,
            price: price,
            rating: rating,
            availability: availability,
            createdAt: new Date()
          });

          await urlObj.save();
        } else {
          console.log(`Failed to fetch data for URL: ${urlObj.url}`);
        }
      } catch (error) {
        console.error(`Error scraping URL: ${urlObj.url}`, error);
      }
    }

    res.json({ message: 'Scraping completed and data updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
