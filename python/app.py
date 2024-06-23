import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_amazon_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract data using BeautifulSoup
        # Example: title
        title_element = soup.select_one('#productTitle')
        title = title_element.text.strip() if title_element else 'N/A'

        # Example: price
        price_element = soup.select_one('.a-price-whole')
        price = price_element.text.strip() if price_element else 'N/A'

        # Extracting rating from the new structure
        rating_element = soup.select_one('a.a-popover-trigger.a-declarative span.a-size-base.a-color-base')
        rating = rating_element.text.strip() if rating_element else 'N/A'

        # Additional data elements (availability example)
        availability_element = soup.select_one('.a-size-medium.a-color-success')
        availability = availability_element.text.strip() if availability_element else 'N/A'

        # Return the results as a dictionary
        return {
            'URL': url,
            'Title': title,
            'Price': price,
            'Rating': rating,
            'Availability': availability
        }
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")
        return None

if __name__ == "__main__":
    # List to hold all scraped data
    data = []

    # Prompt the user to enter Amazon product URLs
    print("Enter Amazon product URLs one by one. Type 'done' to finish.")
    while True:
        url = input("Enter an Amazon product URL: ").strip()
        if url.lower() == 'done':
            break
        result = scrape_amazon_page(url)
        if result:
            data.append(result)

    # Create a DataFrame from the list of dictionaries
    df = pd.DataFrame(data)

    # Save the DataFrame to an Excel file
    df.to_excel('amz.xlsx', index=False)

    print('Scraped data has been saved to amazon_products.xlsx')
