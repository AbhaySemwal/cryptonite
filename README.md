# Cryptonite - Cryptocurrency Tracker

## Overview
Cryptonite is a robust web application designed for real-time cryptocurrency tracking, offering comprehensive market insights and detailed token information.

## Key Features
- Interactive Global Market Cap Chart
- Public Companies' Cryptocurrency Holdings Overview
- Paginated Cryptocurrency List with Advanced Filtering
- In-depth Individual Cryptocurrency Pages
- Seamless Dynamic Theme Switching (Light/Dark Mode)
- Intelligent Search Bar with Recent Suggestions
- Real-time Price Ticker Simulation
- User-friendly Draggable Watchlist

## Tech Stack
- Frontend: Next.js
- Styling: Tailwind CSS
- State Management: Redux Toolkit
- Data Visualization: Chart.js
- API: CoinGecko

## Getting Started

### Prerequisites
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation
1. Clone the repository: git clone https://github.com/AbhaySemwal/cryptonite.git
2. Navigate to the project directory: cd cryptonite
3. Install dependencies: npm i
4. Set up environment variables:
Create a `.env.local` file in the root directory and add your API key: COINGECKO_API_KEY=your_api_key_here


### Running the Application
1. Start the development server: npm run dev
2. Open `http://localhost:3000` in your browser

## Usage Guide

### Core Functionality
- **Watchlist Management**: 
- Add: Drag tokens from the Trending, Explore, and Recently Viewed sections, as well as the Product page title, and drop them into your Watchlist.
- Remove: Click the delete icon next to a token
- View Details: Click on a token for in-depth information
- **Theme Toggle**: Switch between light and dark modes for optimal viewing

### Navigation
- Use the search bar for quick token lookup
- Explore the paginated list for a comprehensive view of available cryptocurrencies
- Click on individual tokens for detailed analysis and historical data

## API Integration

This project leverages the CoinGecko API:

- **Documentation**: [CoinGecko API Docs](https://docs.coingecko.com/v3.0.1/reference/introduction)
- **Rate Limiting**: 30 calls per minute
- **Error Handling**: Fallback content displayed for API or connectivity issues

## Future Enhancements
- Price alerts and notifications
- Integration with additional data sources
- Mobile app development

## Contact
Abhay Semwal - shbhtsemwal@gmail.com

Project Link: [https://github.com/AbhaySemwal/cryptonite](https://github.com/AbhaySemwal/cryptonite)

For any queries or feedback, please don't hesitate to reach out.
