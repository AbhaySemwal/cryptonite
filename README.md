# Cryptonite - Cryptocurrency Tracker

## Overview
Cryptonite is a web application for tracking cryptocurrencies, providing real-time updates, detailed information, and market trends.

## Features
- Global Market Cap Chart
- Public Companies Holdings Information
- Paginated Cryptocurrency List
- Detailed Product Pages for Individual Cryptocurrencies
- Dynamic Theme Switching (Light/Dark Mode)
- Search Bar with Recent Suggestions
- Mock Live Price Ticker
- Draggable Watchlist

## Technologies Used
- Frontend Framework: Next.js
- Styling: Tailwind CSS
- State Management: [Redux Toolkit]
- Charts: [Chart.js]
- API: CoinGecko

## Installation and Setup
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies
4. Create a `.env.local` file in the root directory and add your API key

## Usage

Main Features
Add to Watchlist: Drag and drop cryptocurrency tokens into the watchlist section to track their price and other details.
View Coin Details: Click on a token in the watchlist to navigate to its detailed view, where you can see more in-depth information about the coin.
Remove from Watchlist: Click the delete icon next to a token to remove it from your watchlist.
Toggle Dark Mode: The application supports dark mode and light mode. Toggle between these modes based on your preference.

How to Use
Adding Tokens:Drag a token from a supported source or use the search feature (if available) to add it to your watchlist.
Viewing Details:Click on a token in the watchlist to view its detailed information, including price, market cap, and description.
Removing Tokens:Click on the delete icon next to a token in the watchlist to remove it.
Managing Theme:Toggle the dark mode switch to change the appearance of the application.

## API Information
This project uses the CoinGecko API. Please note the following:
- API documentation: https://docs.coingecko.com/v3.0.1/reference/introduction
- Rate limits: The API allows up to 30 calls per minute. Exceeding this limit may result in temporary blocking of API requests.
- Error handling: For connectivity issues or data fetch errors, appropriate fallback content is shown.
  
## Contact
-Email: shbhtsemwal@gmail.com
-LinkedIn: https://www.linkedin.com/in/abhay-semwal-5092a0226/
