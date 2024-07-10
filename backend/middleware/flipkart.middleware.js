
const axios = require('axios');
const cheerio = require('cheerio');
const FlipkartURL = require('../model/FlipkartURL');


const flipkartGet=async (req, res) => {
    const { userId } = req.params;
    try {
        const urls = await FlipkartURL.find({ userId });

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

                    const isDataDifferent = (newData, oldData) => {
                        return newData.title !== oldData.title ||
                            newData.price !== oldData.price ||
                            newData.rating !== oldData.rating ||
                            newData.availability !== oldData.availability;
                    };

                    if (urlObj.data.length === 0 || isDataDifferent(newData, urlObj.data[urlObj.data.length - 1])) {
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
            }
        }

        const updatedUrls = await FlipkartURL.find({ userId });
        res.json(updatedUrls);
    } catch (err) {
        console.error('Error in GET /:', err.message);
        res.status(500).json({ message: err.message });
    }
}


//POST(adding url)

const flipkartAdd=async (req, res) => {
    const { url, userId } = req.body;

    if (!url || !userId) {
        return res.status(400).json({ message: 'URL and userId are required' });
    }

    try {
        const existingUrl = await FlipkartURL.findOne({ url, userId });
        if (existingUrl) {
            return res.status(400).json({ message: 'URL already exists for this user' });
        }

        const newUrl = new FlipkartURL({ url, userId });
        await newUrl.save();
        res.status(201).json(newUrl);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//Delete(deleting the url)


const flipkartDelete=async (req, res) => {
    try {
        await FlipkartURL.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted URL' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


//Rank of a product

const flipkartRanking=async (req, res) => {
    const { title, keyword } = req.body;

    try {
        let page = 1;
        let found = false;
        let rank = -1;
        let topProducts = [];

        while (!found) {

            const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(keyword)}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off&page=${page}`;


            const response = await axios.get(searchUrl, {
                headers: {
                    // "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Referer": "https://www.flipkart.com/",
                    "DNT": "1",
                    "Connection": "keep-alive"
                }
            });

            if (response.status === 200) {
                const $ = cheerio.load(response.data);

                let items;
                let itemTitleSelector;
                let additionalTitleSelector;

 
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

                    const itemTitlePassed = title; 

                    console.log("Title from Flipkart:", itemTitle);
                    console.log("Title passed:", itemTitlePassed);

                    const passedTitleWithoutAdditional = itemTitlePassed.split('(')[0].trim(); // Extract the title part before '('

                    if (itemTitle.includes(passedTitleWithoutAdditional)) {
                        rank = (page - 1) * items.length + (index + 1); // 
                        found = true;
                        return false; 
                    }
                });

                
                const nextPageExists = $('a._9QVEpD').last().text().includes('Next');
                if (!nextPageExists) {
                    break; 
                }

                page++; 
            } else {
                console.error(`Failed to fetch search results from Flipkart`);
                return res.status(500).json({ message: 'Failed to fetch search results from Flipkart' });
            }
        }

       
        if (rank !== -1) {
            res.status(200).json({ rank, topProducts });
        } else {
           
            res.status(404).json({ message: 'Product not found in search results' });
        }
    } catch (error) {
        
        console.error('Error fetching Flipkart search results:', error.message);
        res.status(500).json({ message: 'Error fetching Flipkart search results' });
    }
}

module.exports={
    flipkartGet,
    flipkartAdd,
    flipkartDelete,
    flipkartRanking
}