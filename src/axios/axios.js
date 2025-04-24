import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    
  },

});

export default instance;
{/*https://pokeapi.co/api/v2/move-learn-method/*/}