import requests
from bs4 import BeautifulSoup

def scrape_amazon_page(url):
    headers = {
        "User-Agent": "Your User Agent String",
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

        # Print the results to the terminal
        print(f'URL: {url}')
        print(f'Title: {title}')
        print(f'Price: {price}')
        print(f'Rating: {rating}')
        print(f'Availability: {availability}')
        print('-' * 30)
    else:
        print(f"Failed to retrieve the page. Status code: {response.status_code}")

if __name__ == "__main__":
    # Prompt the user to enter Amazon product URLs
    print("Enter Amazon product URLs one by one. Type 'done' to finish.")
    while True:
        url = input("Enter an Amazon product URL: ").strip()
        if url.lower() == 'done':
            break
        scrape_amazon_page(url)
