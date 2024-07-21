class PubSub {
    constructor() {
      this.subscribers = {};
    }
  
    subscribe(event, callback) {
      if (!this.subscribers[event]) {
        this.subscribers[event] = [];
      }
      const index = this.subscribers[event].push(callback) - 1;
      return () => {
        this.subscribers[event].splice(index, 1);
      };
    }
  
    publish(event, data) {
      if (!this.subscribers[event]) {
        return;
      }
      this.subscribers[event].forEach(callback => callback(data));
    }
  }
  
  export default new PubSub();