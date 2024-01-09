import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useSearchStore = defineStore('search', () => {
  const query = ref('ocean')
  const enter = ref(false)

  interface SearchResult {
    photos: (params: object) => Promise<object>;
    videos: (params: object) => Promise<object>;
    search: (type: 'photos' | 'videos', params: object) => Promise<object>;
  }
  
  const searcher: SearchResult = {
    async photos(params) {
      return this.search('photos', params);
    },
    async videos(params) {
      return this.search('videos', params);
    },
    async search(type, params) {
      let uri, endpoint;
  
      if (type === 'photos') {
        uri = 'https://api.pexels.com/v1/search';
        endpoint = 'photos';
      } else if (type === 'videos') {
        uri = 'https://api.pexels.com/videos/search';
        endpoint = 'videos';
      } else {
        throw new Error('Tipo no válido. Debe ser "photos" o "videos".');
      }
  
      const options = {
        method: 'GET',
        url: uri,
        params: params,
        headers: {
          Authorization: import.meta.env.VITE_PEXELS_API_KEY,
        },
      };
  
      try {
        const response = await axios.request(options);
        return response.data[endpoint]; // Retorna fotos o videos según el tipo
      } catch (error) {
        console.error(error);
        throw error; // Propaga el error para que sea manejado por quien llama a la función
      }
    },
  };

  return { query, enter, searcher }
})