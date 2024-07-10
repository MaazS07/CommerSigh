const axios = require("axios");
const cheerio = require("cheerio");
const AmazonUrl = require("../model/AmazonURL");


const amazonGet =async (req, res) => {
    const { userId } = req.params;
    try {
      const urls = await AmazonUrl.find();
  
      for (let urlObj of urls) {
        try {
          const response = await axios.get(urlObj.url, {});
  
          if (response.status === 200) {
            const $ = cheerio.load(response.data);
  
            const title = $("#productTitle").text().trim() || "N/A";
            const price = $(".a-price-whole").first().text().trim() || "N/A";
            const rating =
              $("a.a-popover-trigger.a-declarative span.a-size-base.a-color-base")
                .text()
                .trim() || "N/A";
            const availability =
              $(".a-size-medium.a-color-success").text().trim() || "N/A";
  
            const newData = {
              title,
              price,
              rating,
              availability,
            };
  
            const isDataDifferent = (newData, oldData) => {
              return (
                newData.title !== oldData.title ||
                newData.price !== oldData.price ||
                newData.rating !== oldData.rating ||
                newData.availability !== oldData.availability
              );
            };
  
            if (
              urlObj.data.length === 0 ||
              isDataDifferent(newData, urlObj.data[urlObj.data.length - 1])
            ) {
              urlObj.data.push({
                ...newData,
                createdAt: new Date(),
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
  
      const updatedUrls = await AmazonUrl.find({ userId });
      res.json(updatedUrls);
    } catch (err) {
      console.error("Error in GET /:", err.message);
      res.status(500).json({ message: err.message });
    }
  }

//POST Amazon ( addURL)

const amazonAdd=async (req, res) => {
    const { url, userId } = req.body;
  
    if (!url || !userId) {
      return res.status(400).json({ message: "URL and userId are required" });
    }
  
    try {
      const existingUrl = await AmazonUrl.findOne({ url, userId });
      if (existingUrl) {
        return res
          .status(400)
          .json({ message: "URL already exists for this user" });
      }
  
      const newUrl = new AmazonUrl({ url, userId });
      await newUrl.save();
      res.status(201).json(newUrl);
    } catch (err) {
      if (err.code === 11000) {
        return res
          .status(400)
          .json({ message: "URL already exists for this user" });
      }
      res
        .status(500)
        .json({ message: "An error occurred while processing your request" });
    }
  }

  //Delete (deleting URL)

  const amazonDelete= async (req, res) => {
    try {
      await AmazonUrl.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted URL" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }


  //Ranking ( Product Ranking)



const amazonProductRanking=async (req, res) => {
    const { title, keyword } = req.body;
  
    try {
      let page = 1;
      let found = false;
      let rank = -1;
      let topProducts = [];
  
      while (!found) {
        const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(
          keyword
        )}&crid=UUQ4CAGPONAW&sprefix=${encodeURIComponent(
          keyword
        )}%2Caps%2C200&ref=nb_sb_noss_1&page=${page}`;
  
        const response = await axios.get(searchUrl, {
          headers: {
            "Accept-Language": "en-US,en;q=0.5",
            Referer: "https://www.amazon.com/",
            DNT: "1",
            Connection: "keep-alive",
            "Upgrade-Insecure-Requests": "1",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
          },
        });
  
        if (response.status === 200) {
          const $ = cheerio.load(response.data);
  
          let items;
          let itemTitleSelector;
  
          const potentialSelectors = [
            "div.s-card-container",
            "div.s-result-item",
            "div .s-title-instructions-style"
          ];
  
          for (const selector of potentialSelectors) {
            items = $(selector);
            if (items.length > 0) {
              itemTitleSelector = "span.a-text-normal";
              break;
            }
          }
  
          if (!itemTitleSelector) {
            console.error("No suitable selector found for scraping Amazon");
            return res
              .status(500)
              .json({ message: "Failed to fetch search results from Amazon" });
          }
  
          items.each((index, element) => {
            const itemTitleElement = $(element).find(itemTitleSelector);
            const itemTitle = itemTitleElement.text().trim();
            console.log(`Page ${page} - Item ${index + 1}: ${itemTitle}`);
  
            if (topProducts.length < 5) {
              const itemPrice = $(element)
                .find(".a-price-whole")
                .first()
                .text()
                .trim();
              const itemRating = $(element)
                .find(".a-icon-alt")
                .first()
                .text()
                .trim();
              topProducts.push({
                title: itemTitle,
                price: itemPrice,
                rating: itemRating,
              });
            }
  
            if (itemTitle.includes(title)) {
              rank = (page - 1) * items.length + (index + 1);
              found = true;
              return false; 
            }
          });
  
          if (found) break; 
  
          const nextPageExists =
            $("div.s-pagination-container").find(".s-pagination-next").length > 0;
          if (!nextPageExists) {
            break; 
          }
  
          page++;
        } else {
          console.error(`Failed to fetch search results from Amazon`);
          return res
            .status(500)
            .json({ message: "Failed to fetch search results from Amazon" });
        }
      }
  
      if (rank !== -1) {
        res.status(200).json({ rank, topProducts });
      } else {
        res
          .status(404)
          .json({ message: "Product not found in search results", topProducts });
      }
    } catch (error) {
      console.error("Error fetching Amazon search results:", error.message);
      res.status(500).json({ message: "Error fetching Amazon search results" });
    }
  }


  module.exports={
    amazonGet,
    amazonAdd,
    amazonDelete,
    amazonProductRanking
  }