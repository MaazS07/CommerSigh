const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

// Model import
const FlipkartURL = require('../model/FlipkartURL');

// Middleware to check authentication
const authenticateUser = (req, res, next) => {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }
    req.userId = userId;
    next();
  };
  

// GET all Flipkart URLs for a user and perform scraping
router.get('/:userId', authenticateUser, async (req, res) => {
    const { userId } = req.params;
    try {
        const urls = await FlipkartURL.find({ userId });

        // Perform scraping for each URL
        for (let urlObj of urls) {
            try {
                const response = await axios.get(urlObj.url, {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Referer": "https://www.flipkart.com/",
                        "DNT": "1",
                        "Connection": "keep-alive"
                    }
                });

                if (response.status === 200) {
                    const $ = cheerio.load(response.data);

                    const title = $('.VU-ZEz').text().trim() || 'N/A';
                    const price = $('div.Nx9bqj.CxhGGd').text().trim() || 'N/A';
                    const rating = $('div.XQDdHH').text().trim() || 'N/A';
                    let availability;
                    if ($('div.nbiUlm').text().trim()) {
                        availability = "Out of Stock";
                    } else {
                        availability = 'In Stock';
                    };

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

        const updatedUrls = await FlipkartURL.find({ userId });
        res.json(updatedUrls);
    } catch (err) {
        console.error('Error in GET /:', err.message);
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    const { url, userId } = req.body;

    if (!url || !userId) {
        return res.status(400).json({ message: 'URL and userId are required' });
    }

    try {
        // Check for existing URL for the specific userId
        const existingUrl = await FlipkartURL.findOne({ url, userId });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists for this user' });
        }

        // Create and save the new URL for the user
        const newUrl = new FlipkartURL({ url, userId });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (err) {
        res.status(500).json({ message: err.message }); // Change status to 500 for server errors
    }
});
// DELETE a URL
router.delete('/:id', async (req, res) => {
    try {
        await FlipkartURL.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted URL' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// POST to get ranking
// router.post('/ranking', async (req, res) => {
//     const { title, keyword } = req.body;

//     try {
//         // Construct the search URL with the encoded keyword
//         const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`;

//         // Make GET request to Flipkart search URL
//         const response = await axios.get(searchUrl, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
//                 "Accept-Language": "en-US,en;q=0.5",
//                 "Referer": "https://www.flipkart.com/",
//                 "DNT": "1",
//                 "Connection": "keep-alive"
//             }
//         });

//         // Check if the response status is 200 (OK)
//         if (response.status === 200) {
//             const $ = cheerio.load(response.data);

//             // Find all items in the search results
//             const items = $('div.tUxRFH');

//             let rank = -1;

//             // Iterate over each item in the search results
//             items.each((index, element) => {
//                 const itemTitle = $(element).find('div.KzDlHZ').text().trim();

//                 // Check if the item title includes the desired product title
//                 if (itemTitle.includes(title)) {
//                     rank = index + 1; // Set the rank (1-based index)
//                     return false; // Exit the each loop
//                 }
//             });

//             // If rank is found, respond with 200 and rank information
//             if (rank !== -1) {
//                 res.status(200).json({ rank });
//             } else {
//                 // If product not found, respond with 404
//                 res.status(404).json({ message: 'Product not found in search results' });
//             }
//         } else {
//             // Handle cases where Flipkart does not respond with status 200
//             console.error(`Failed to fetch search results from Flipkart`);
//             res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
//         }
//     } catch (error) {
//         // Handle any errors that occur during the request or parsing
//         console.error('Error fetching Flipkart search results:', error.message);
//         res.status(500).json({ message: 'Error fetching Flipkart search results' });
//     }
// });



// router.post('/ranking', async (req, res) => {
//     const { title, keyword } = req.body;

//     try {
//         // Construct the search URL with the encoded keyword
//         const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=1`;

//         // Make GET request to Flipkart search URL
//         const response = await axios.get(searchUrl, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
//                 "Accept-Language": "en-US,en;q=0.5",
//                 "Referer": "https://www.flipkart.com/",
//                 "DNT": "1",
//                 "Connection": "keep-alive"
//             }
//         });

//         // Check if the response status is 200 (OK)
//         if (response.status === 200) {
//             const $ = cheerio.load(response.data);

//             let items;
//             let itemTitleSelector;
//             let additionalTitleSelector;

//             // Check each potential selector until items are found
//             const potentialSelectors = [
//                 { selector: 'div.slAVV4', titleSelector: 'a.wjcEIp', additionalTitleSelector: 'div.NqpwHC' }, // For first type with additional text
//                 { selector: 'div.tUxRFH', titleSelector: 'div.KzDlHZ' } // For second type without additional text
//                 // Add more potential selectors based on observed variations
//             ];

//             for (const { selector, titleSelector, additionalTitleSelector: additionalSelector } of potentialSelectors) {
//                 items = $(selector);

//                 if (items.length > 0) {
//                     itemTitleSelector = titleSelector;
//                     if (additionalSelector) {
//                         additionalTitleSelector = additionalSelector;
//                     }
//                     break;
//                 }
//             }

//             if (!itemTitleSelector) {
//                 console.error('No suitable selector found for scraping Flipkart');
//                 return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
//             }

//             let rank = -1;
//             let itemTitle="";
//             // Iterate over each item in the search results
//             items.each((index, element) => {
//                 let itemTitle;
//                 const itemTitleFromFlipkart = $(element).find(itemTitleSelector).attr('title');
            
//                 if (itemTitleFromFlipkart) {
//                     const additionalText = $(element).find(additionalTitleSelector).text().trim();
//                     itemTitle = `${itemTitleFromFlipkart} (${additionalText})`;
//                 } else {
//                     itemTitle = $(element).find(itemTitleSelector).text().trim();
//                 }
            
//                 const itemTitlePassed = title; // Assuming 'title' is the title you're passing
            
//                 console.log("Title from Flipkart:", itemTitle);
//                 console.log("Title passed:", itemTitlePassed);
            
//                 // Check if the item title includes the desired product title, ignoring the additional text
//                 const passedTitleWithoutAdditional = itemTitlePassed.split('(')[0].trim(); // Extract the title part before '('
            
//                 if (itemTitle.includes(passedTitleWithoutAdditional)) {
//                     rank = index + 1; // Set the rank (1-based index)
//                     return false; // Exit the each loop
//                 }
//             });
            

//             // If rank is found, respond with 200 and rank information
//             if (rank !== -1) {
//                 res.status(200).json({ rank });
//             } else {
//                 // If product not found, respond with 404
//                 res.status(404).json({ message: 'Product not found in search results' });
//             }
//         } else {
//             // Handle cases where Flipkart does not respond with status 200
//             console.error(`Failed to fetch search results from Flipkart`);
//             res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
//         }
//     } catch (error) {
//         // Handle any errors that occur during the request or parsing
//         console.error('Error fetching Flipkart search results:', error.message);
//         res.status(500).json({ message: 'Error fetching Flipkart search results' });
//     }
   
// });



// router.post('/ranking', async (req, res) => {
//     const { title, keyword } = req.body;

//     try {
//         let page = 1;
//         let found = false;
//         let rank = -1;
//         let topProducts=[]

//         while (!found) {
//             // Construct the search URL with the encoded keyword and current page number
//             const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=${page}`;

//             // Make GET request to Flipkart search URL
//             const response = await axios.get(searchUrl, {
//                 headers: {
//                     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
//                     "Accept-Language": "en-US,en;q=0.5",
//                     "Referer": "https://www.flipkart.com/",
//                     "DNT": "1",
//                     "Connection": "keep-alive"
//                 }
//             });

//             // Check if the response status is 200 (OK)
//             if (response.status === 200) {
//                 const $ = cheerio.load(response.data);

//                 let items;
//                 let itemTitleSelector;
//                 let additionalTitleSelector;

//                 // Check each potential selector until items are found
//                 const potentialSelectors = [
//                     { selector: 'div.slAVV4', titleSelector: 'a.wjcEIp', additionalTitleSelector: 'div.NqpwHC' }, // For first type with additional text
//                     { selector: 'div.tUxRFH', titleSelector: 'div.KzDlHZ' } // For second type without additional text
//                     // Add more potential selectors based on observed variations
//                 ];

//                 for (const { selector, titleSelector, additionalTitleSelector: additionalSelector } of potentialSelectors) {
//                     items = $(selector);

//                     if (items.length > 0) {
//                         itemTitleSelector = titleSelector;
//                         if (additionalSelector) {
//                             additionalTitleSelector = additionalSelector;
//                         }
//                         break;
//                     }
//                 }

//                 if (!itemTitleSelector) {
//                     console.error('No suitable selector found for scraping Flipkart');
//                     return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
//                 }

//                 // Iterate over each item in the search results
//                 items.each((index, element) => {
//                     let itemTitle;
//                     const itemTitleFromFlipkart = $(element).find(itemTitleSelector).attr('title');
                
//                     if (itemTitleFromFlipkart) {
//                         const additionalText = $(element).find(additionalTitleSelector).text().trim();
//                         itemTitle = `${itemTitleFromFlipkart} (${additionalText})`;
//                     }  if (topProducts.length < 5) {
//                         const itemPrice = $(element).find('.div.Nx9bqj._4b5DiR').first().text().trim() || $(element).find('div.Nx9bqj').first().text().trim();
//                         const itemRating = $(element).find('div.XQDdHH').first().text().trim();
//                         topProducts.push({
//                             title: itemTitle,
//                             price: itemPrice,
//                             rating: itemRating
//                         });
//                     }
//                     else {
//                         itemTitle = $(element).find(itemTitleSelector).text().trim();
//                     }
                
//                     const itemTitlePassed = title; // Assuming 'title' is the title you're passing
                
//                     console.log("Title from Flipkart:", itemTitle);
//                     console.log("Title passed:", itemTitlePassed);
                
//                     // Check if the item title includes the desired product title, ignoring the additional text
//                     const passedTitleWithoutAdditional = itemTitlePassed.split('(')[0].trim(); // Extract the title part before '('
                
//                     if (itemTitle.includes(passedTitleWithoutAdditional)) {
//                         rank = (page - 1) * items.length + (index + 1); // Calculate rank considering pagination
//                         found = true;
//                         return false; // Exit the each loop
//                     }
//                 });

//                 // Check if there are more pages
//                 const nextPageExists = $('a._9QVEpD').last().text().includes('Next');
//                 if (!nextPageExists) {
//                     break; // Exit the loop if no more pages
//                 }

//                 page++; // Increment page number for next request
//             } else {
//                 // Handle cases where Flipkart does not respond with status 200
//                 console.error(`Failed to fetch search results from Flipkart`);
//                 return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
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
//         console.error('Error fetching Flipkart search results:', error.message);
//         res.status(500).json({ message: 'Error fetching Flipkart search results' });
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
            // Construct the search URL with the encoded keyword and current page number
            const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=${page}`;

            // Make GET request to Flipkart search URL
            const response = await axios.get(searchUrl, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Referer": "https://www.flipkart.com/",
                    "DNT": "1",
                    "Connection": "keep-alive"
                }
            });

            // Check if the response status is 200 (OK)
            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                let items;
                let itemTitleSelector;
                let additionalTitleSelector;

                // Check each potential selector until items are found
                const potentialSelectors = [
                    { selector: 'div.slAVV4', titleSelector: 'a.wjcEIp', additionalTitleSelector: 'div.NqpwHC' }, // For first type with additional text
                    { selector: 'div.tUxRFH', titleSelector: 'div.KzDlHZ' } // For second type without additional text
                    // Add more potential selectors based on observed variations
                ];

                for (const { selector, titleSelector, additionalTitleSelector: additionalSelector } of potentialSelectors) {
                    items = $(selector);

                    if (items.length > 0) {
                        itemTitleSelector = titleSelector;
                        if (additionalSelector) {
                            additionalTitleSelector = additionalSelector;
                        }
                        break;
                    }
                }

                if (!itemTitleSelector) {
                    console.error('No suitable selector found for scraping Flipkart');
                    return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
                }

                // Iterate over each item in the search results
                items.each((index, element) => {
                    let itemTitle;
                    const itemTitleFromFlipkart = $(element).find(itemTitleSelector).attr('title');
                    
                    if (itemTitleFromFlipkart) {
                        const additionalText = $(element).find(additionalTitleSelector).text().trim();
                        itemTitle = `${itemTitleFromFlipkart} (${additionalText})`;
                    } else {
                        itemTitle = $(element).find(itemTitleSelector).text().trim();
                    }

                    if (topProducts.length < 5) {
                        const itemPrice = $(element).find('.div.Nx9bqj._4b5DiR').first().text().trim() || $(element).find('div.Nx9bqj').first().text().trim();
                        const itemRating = $(element).find('div.XQDdHH').first().text().trim();
                        topProducts.push({
                            title: itemTitle,
                            price: itemPrice,
                            rating: itemRating
                        });
                    }

                    const itemTitlePassed = title; // Assuming 'title' is the title you're passing

                    console.log("Title from Flipkart:", itemTitle);
                    console.log("Title passed:", itemTitlePassed);

                    // Check if the item title includes the desired product title, ignoring the additional text
                    const passedTitleWithoutAdditional = itemTitlePassed.split('(')[0].trim(); // Extract the title part before '('

                    if (itemTitle.includes(passedTitleWithoutAdditional)) {
                        rank = (page - 1) * items.length + (index + 1); // Calculate rank considering pagination
                        found = true;
                        return false; // Exit the each loop
                    }
                });

                // Check if there are more pages
                const nextPageExists = $('a._9QVEpD').last().text().includes('Next');
                if (!nextPageExists) {
                    break; // Exit the loop if no more pages
                }

                page++; // Increment page number for next request
            } else {
                // Handle cases where Flipkart does not respond with status 200
                console.error(`Failed to fetch search results from Flipkart`);
                return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
            }
        }

        // If rank is found, respond with 200 and rank information
        if (rank !== -1) {
            res.status(200).json({ rank, topProducts });
        } else {
            // If product not found, respond with 404
            res.status(404).json({ message: 'Product not found in search results' });
        }
    } catch (error) {
        // Handle any errors that occur during the request or parsing
        console.error('Error fetching Flipkart search results:', error.message);
        res.status(500).json({ message: 'Error fetching Flipkart search results' });
    }
});



//main
// router.post('/ranking', async (req, res) => {
//     const { title, keyword } = req.body;

//     try {
//         let page = 1;
//         let found = false;
//         let rank = -1;
//         let topProducts = [];

//         while (!found ) {
//             const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=${page}`;

//             try {
//                 const response = await axios.get(searchUrl, {
//                     headers: {
//                         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
//                         "Accept-Language": "en-US,en;q=0.5",
//                         "Referer": "https://www.flipkart.com/",
//                         "DNT": "1",
//                         "Connection": "keep-alive"
//                     },
                    
//                 });

//                 if (response.status === 200) {
//                     const $ = cheerio.load(response.data);

//                     let items;
//                     let itemTitleSelector;
//                     let additionalTitleSelector;
//                     let ratingSelector;
//                     let priceSelector;

//                     const potentialSelectors = [
//                         { selector: 'div.slAVV4', titleSelector: 'a.wjcEIp', additionalTitleSelector: 'div.NqpwHC', ratingSelector: 'div.XQDdHH', priceSelector: 'div.Nx9bqj' },
//                         { selector: 'div.tUxRFH', titleSelector: 'div.KzDlHZ', ratingSelector: 'div.XQDdHH', priceSelector: 'div.Nx9bqj._4b5DiR' }
//                     ];

//                     for (const { selector, titleSelector, additionalTitleSelector: additionalSelector, ratingSelector: ratingSel, priceSelector: priceSel } of potentialSelectors) {
//                         items = $(selector);

//                         if (items.length > 0) {
//                             itemTitleSelector = titleSelector;
//                             ratingSelector = ratingSel;
//                             priceSelector = priceSel;
//                             if (additionalSelector) {
//                                 additionalTitleSelector = additionalSelector;
//                             }
//                             break;
//                         }
//                     }

//                     if (!itemTitleSelector) {
//                         console.error('No suitable selector found for scraping Flipkart');
//                         continue; // Skip to next page instead of returning error
//                     }

//                     items.each((index, element) => {
//                         let itemTitle;
//                         const itemTitleFromFlipkart = $(element).find(itemTitleSelector).attr('title');
                    
//                         if (itemTitleFromFlipkart) {
//                             const additionalText = $(element).find(additionalTitleSelector).text().trim();
//                             itemTitle = `${itemTitleFromFlipkart} (${additionalText})`;
//                         } else {
//                             itemTitle = $(element).find(itemTitleSelector).text().trim();
//                         }
                    
//                         const itemRating = $(element).find(ratingSelector).text().trim();
//                         const itemPrice = $(element).find(priceSelector).text().trim();
                    
//                         if (topProducts.length < 5) {
//                             topProducts.push({
//                                 title: itemTitle,
//                                 rating: itemRating,
//                                 price: itemPrice
//                             });
//                         }
                    
//                         if (!found && itemTitle.toLowerCase().includes(title.toLowerCase())) {
//                             rank = (page - 1) * items.length + (index + 1);
//                             found = true;
//                         }
//                     });

//                     const nextPageExists = $('a._9QVEpD').last().text().includes('Next');
//                     if (!nextPageExists) {
//                         break; // Exit the loop if no more pages
//                     }

//                     page++;
//                 } else {
//                     console.error(`Failed to fetch search results from Flipkart`);
//                     break; // Exit the loop on non-200 status
//                 }
//             } catch (error) {
//                 console.error(`Error on page ${page}:`, error.message);
//                 break; // Exit the loop on error
//             }
//         }

//         // Always return the top products, even if the specific product is not found
//         if (found) {
//             res.status(200).json({ rank, topProducts });
//         } else {
//             res.status(404).json({ message: 'Product not found in search results', topProducts });
//         }
//     } catch (error) {
//         console.error('Error fetching Flipkart search results:', error.message);
//         res.status(500).json({ message: 'Error fetching Flipkart search results', topProducts });
//     }
// });
module.exports = router;
