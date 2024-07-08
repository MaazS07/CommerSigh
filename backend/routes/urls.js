const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const Url = require('../model/Url');

// Get all URLs and perform scraping

const authenticateUser = (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }
    req.userId = userId;
    next();
  };

router.get('/:userId', authenticateUser, async (req, res) => {
    const { userId } = req.params;
    try {
        const urls = await Url.find();

        for (let urlObj of urls) {
            try {
                const response = await axios.get(urlObj.url, {
                    // headers: {
                    //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
                    //     ,
                    //     "Accept-Language": "en-US,en;q=0.5",
                    //     "Referer": "https://www.flipkart.com/",
                    //     "DNT": "1",
                    //     "Connection": "keep-alive"
                    // }
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
                    };
                    
                    // Function to compare objects without considering the createdAt field
                    const isDataDifferent = (newData, oldData) => {
                        return newData.title !== oldData.title ||
                               newData.price !== oldData.price ||
                               newData.rating !== oldData.rating ||
                               newData.availability !== oldData.availability;
                    };
                    
                    // Check if there's existing data and if it's different from the new data
                    if (urlObj.data.length === 0 || isDataDifferent(newData, urlObj.data[urlObj.data.length - 1])) {
                        // If it's different, add the new data with the current timestamp
                        urlObj.data.push({
                            ...newData,
                            createdAt: new Date()
                        });
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

        const updatedUrls = await Url.find({userId});
        res.json(updatedUrls);
    } catch (err) {
        console.error('Error in GET /:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Add a new URL
router.post('/', async (req, res) => {
    const { url, userId } = req.body;

    if (!url || !userId) {
        return res.status(400).json({ message: 'URL and userId are required' });
    }

    try {
        // Change this line
        const existingUrl = await Url.findOne({ url, userId });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists for this user' });
        }

        // Create and save the new URL for the user
        const newUrl = new Url({ url, userId });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (err) {
        if (err.code === 11000) {
            // Handle the duplicate key error
            return res.status(400).json({ message: 'URL already exists for this user' });
        }
        res.status(500).json({ message: 'An error occurred while processing your request' });
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




// router.post('/ranking', async (req, res) => {
//     const { title, keyword } = req.body;

//     try {
//         let page = 1;
//         let found = false;
//         let rank = -1;

//         while (!found) {
//             // Construct the search URL with the encoded keyword and current page number
//             const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}&crid=UUQ4CAGPONAW&sprefix=${encodeURIComponent(keyword)}%2Caps%2C200&ref=nb_sb_noss_1&page=${page}`;

//             // Make GET request to Amazon search URL
//             const response = await axios.get(searchUrl, {
//                 headers: {
//                     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
//                     "Accept-Language": "en-US,en;q=0.5",
//                     "Referer": "https://www.amazon.com/",
//                     "DNT": "1",
//                     "Connection": "keep-alive"
//                 }
//             });

//             // Check if the response status is 200 (OK)
//             if (response.status === 200) {
//                 const $ = cheerio.load(response.data);

//                 let items;
//                 let itemTitleSelector;

//                 // Define potential selectors based on observed variations in Amazon's HTML structure
//                 const potentialSelectors = [
//                     'div.s-card-container',    // Example of an alternative selector, adjust as needed
//                     'div.s-result-item'        // Common selector for search result items
//                 ];

//                 for (const selector of potentialSelectors) {
//                     items = $(selector);

//                     if (items.length > 0) {
//                         itemTitleSelector = 'span.a-text-normal'; // Default item title selector, adjust if needed
//                         break;
//                     }
//                 }

//                 if (!itemTitleSelector) {
//                     console.error('No suitable selector found for scraping Amazon');
//                     return res.status(500).json({ message: 'Failed to fetch search results from Amazon' });
//                 }

//                 // Iterate over each item in the search results
//                 items.each((index, element) => {
//                     const itemTitleElement = $(element).find(itemTitleSelector);
//                     const itemTitle = itemTitleElement.text().trim();
//                     console.log(`Page ${page} - Item ${index + 1}: ${itemTitle}`);

//                     // Check if the item title includes the desired product title
//                     if (itemTitle.includes(title)) {
//                         rank = (page - 1) * items.length + (index + 1); // Calculate rank considering pagination
//                         found = true;
//                         return false; // Exit the each loop
//                     }
//                 });

//                 // Check if there are more pages using the provided selector
//                 const nextPageExists = $('div.s-pagination-container').find('.s-pagination-next').length > 0;
//                 if (!nextPageExists) {
//                     break; // Exit the loop if no more pages
//                 }

//                 page++; // Increment page number for next request
//             } else {
//                 // Handle cases where Amazon does not respond with status 200
//                 console.error(`Failed to fetch search results from Amazon`);
//                 return res.status(500).json({ message: 'Failed to fetch search results from Amazon' });
//             }
//         }

//         // If rank is found, respond with 200 and rank information
//         if (rank !== -1) {
//             res.status(200).json({ rank });
//         } else {
//             // If product not found, respond with 404
//             res.status(404).json({ message: 'Product not found in search results' });
//         }
//     } catch (error) {
//         // Handle any errors that occur during the request or parsing
//         console.error('Error fetching Amazon search results:', error.message);
//         res.status(500).json({ message: 'Error fetching Amazon search results' });
//     }
// });



router.post('/ranking', async (req, res) => {
    const { title, keyword } = req.body;

    try {
        let page = 1;
        let found = false;
        let rank = -1;
        let topProducts = [];

        while (!found) {
            const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(keyword)}&crid=UUQ4CAGPONAW&sprefix=${encodeURIComponent(keyword)}%2Caps%2C200&ref=nb_sb_noss_1&page=${page}`;

            const response = await axios.get(searchUrl, {
                headers: {
                    "Accept-Language": "en-US,en;q=0.5",
                    "Referer": "https://www.amazon.com/",
                    "DNT": "1",
                    "Connection": "keep-alive",
                    "Upgrade-Insecure-Requests": "1",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br"
                }
            });

            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                let items;
                let itemTitleSelector;

                const potentialSelectors = [
                    'div.s-card-container',
                    'div.s-result-item'
                ];

                for (const selector of potentialSelectors) {
                    items = $(selector);
                    if (items.length > 0) {
                        itemTitleSelector = 'span.a-text-normal';
                        break;
                    }
                }

                if (!itemTitleSelector) {
                    console.error('No suitable selector found for scraping Amazon');
                    return res.status(500).json({ message: 'Failed to fetch search results from Amazon' });
                }

                items.each((index, element) => {
                    const itemTitleElement = $(element).find(itemTitleSelector);
                    const itemTitle = itemTitleElement.text().trim();
                    console.log(`Page ${page} - Item ${index + 1}: ${itemTitle}`);

                    if (topProducts.length < 5) {
                        const itemPrice = $(element).find('.a-price-whole').first().text().trim();
                        const itemRating = $(element).find('.a-icon-alt').first().text().trim();
                        topProducts.push({
                            title: itemTitle,
                            price: itemPrice,
                            rating: itemRating
                        });
                    }

                    if (itemTitle.includes(title)) {
                        rank = (page - 1) * items.length + (index + 1);
                        found = true;
                        return false; // Exit the each loop
                    }
                });

                if (found) break; // Exit the while loop if the product is found

                const nextPageExists = $('div.s-pagination-container').find('.s-pagination-next').length > 0;
                if (!nextPageExists) {
                    break; // Exit the loop if no more pages
                }

                page++;
            } else {
                console.error(`Failed to fetch search results from Amazon`);
                return res.status(500).json({ message: 'Failed to fetch search results from Amazon' });
            }
        }

        if (rank !== -1) {
            res.status(200).json({ rank, topProducts });
        } else {
            res.status(404).json({ message: 'Product not found in search results', topProducts });
        }
    } catch (error) {
        console.error('Error fetching Amazon search results:', error.message);
        res.status(500).json({ message: 'Error fetching Amazon search results' });
    }
});


















module.exports = router;