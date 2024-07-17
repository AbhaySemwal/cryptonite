import React from 'react';
import Link from 'next/link';

const CoinList = ({ coins }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {coins.map(coin => (
        <Link href={`/coin/${coin.id}`} key={coin.id}>
          <a className="p-4 border rounded hover:shadow-lg transition-shadow">
            <img src={coin.image} alt={coin.name} className="w-16 h-16 mb-2" />
            <h3 className="text-lg font-bold">{coin.name}</h3>
            <p>Price: ${coin.current_price}</p>
            <p>24h Change: {coin.price_change_percentage_24h.toFixed(2)}%</p>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default CoinList;