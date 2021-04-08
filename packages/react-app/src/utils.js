import axios from 'axios';
import { addresses } from '@project/contracts';

const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=pepemon-pepeballs,pepedex&vs_currencies=usd';
const OPENSEA_API_URL = 'https://api.opensea.io/api/v1';

const utils = {
  getPrices: async function() {
    return axios.get(PRICE_URL);
  },

  getCards: async function(address) {
    return axios.get(OPENSEA_API_URL + '/assets', {
      params: {
        order_direction: 'desc',
        offset: 0,
        limit: 20,
        asset_contract_address: addresses.pepemon_nfts,
        owner: address
      }
    });
  }
};

export default utils;