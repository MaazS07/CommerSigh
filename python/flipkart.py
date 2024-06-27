import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import os.path
import xlwings as xw
import time
import random

def scrape_flipkart_page(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": "https://www.flipkart.com/",
        "DNT": "1",  # Do Not Track Request Header
        "Connection": "keep-alive"
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract data using BeautifulSoup
        title_element = soup.select_one('.VU-ZEz')
        title = title_element.text.strip() if title_element else 'N/A'

        price_element = soup.select_one('div.Nx9bqj.CxhGGd')
        price = price_element.text.strip() if price_element else 'N/A'

        rating_element = soup.select_one('div.XQDdHH')
        rating = rating_element.text.strip() if rating_element else 'N/A'

        availability_element = soup.select_one('div._1_WHN1')
        availability = availability_element.text.strip() if availability_element else 'In Stock'

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        return {
            'Timestamp': timestamp,
            'URL': url,
            'Title': title,
            'Price': price,
            'Rating': rating,
            'Availability': availability
        }
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
    except Exception as err:
        print(f"Other error occurred: {err}")

    return None

if __name__ == "__main__":
    data = []

    print("Enter Flipkart product URLs one by one. Type 'done' to finish.")
    while True:
        url = input("Enter a Flipkart product URL: ").strip()
        if url.lower() == 'done':
            break
        result = scrape_flipkart_page(url)
        if result:
            data.append(result)
        time.sleep(random.uniform(1, 3))

    df = pd.DataFrame(data)

    filename = 'flipkart.xlsx'

    if os.path.isfile(filename):
        try:
            wb = xw.Book(filename)
            sheet = wb.sheets[0]

            next_row = sheet.range('A' + str(sheet.cells.last_cell.row)).end('up').row + 1
            sheet.range('A' + str(next_row)).value = df.values.tolist()

            wb.save()
            wb.close()
        except Exception as e:
            print(f"Error opening existing Excel file: {e}")
            print("Creating a new Excel file.")
            df.to_excel(filename, index=False)
    else:
        df.to_excel(filename, index=False)
        print(f'Created new file {filename} and saved scraped data')

    print(f'Scraped data has been saved to {filename}')
