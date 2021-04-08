import axios from 'axios';

const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=pepemon-pepeballs,pepedex&vs_currencies=usd';

const utils = {
  getPrices: async function() {
    return axios.get(PRICE_URL);
  }
};

export default utils;