import PubSub from './PubSub';

class LivePriceService {
  constructor() {
    this.prices = {};
    this.intervals = {};
  }

  startUpdates(coinId, initialPrice) {
    this.prices[coinId] = initialPrice;
    
    const updatePrice = () => {
      const changePercent = (Math.random() - 0.5) * 0.02;
      this.prices[coinId] *= (1 + changePercent);
      PubSub.publish('priceUpdate', { coinId, price: this.prices[coinId] });
    };

    updatePrice(); // Initial update
    this.intervals[coinId] = setInterval(updatePrice, 60000);
  }

  stopUpdates(coinId) {
    if (this.intervals[coinId]) {
      clearInterval(this.intervals[coinId]);
      delete this.intervals[coinId];
    }
  }

  getCurrentPrice(coinId) {
    return this.prices[coinId];
  }
}

export default new LivePriceService();