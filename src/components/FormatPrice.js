function addCommasToPrice(price) {
    const parts = price.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  
  export function formatPrice(price) {
    return addCommasToPrice(price);
  }