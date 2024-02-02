import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios';

export const useSearchStore = defineStore('search', () => {
  const defaultQuery = 'ocean';
  const query = ref(defaultQuery);
  const orientation = ref<'landscape' | 'portrait' | 'square' | undefined>(undefined);

  const apiKeyValue = ref(import.meta.env.VITE_PEXELS_API_KEY);

  if (!apiKeyValue.value) {
    apiKeyValue.value = localStorage.getItem('PEXELS_API_KEY');
  }

  interface SearchResult {
    photos: (params: object) => Promise<object>;
    videos: (params: object) => Promise<object>;
    search: (type: 'photos' | 'videos', params: { query?: string; orientation?: 'landscape' | 'portrait' | 'square' } & object) => Promise<object>;
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
        uri = 'https://api.pexels.com/v1/search?locale=es-ES';
        endpoint = 'photos';
      } else if (type === 'videos') {
        uri = 'https://api.pexels.com/videos/search?locale=es-ES';
        endpoint = 'videos';
      } else {
        throw new Error('Tipo no válido. Debe ser "photos" o "videos".');
      }

      // Si query está vacío, usa el valor por defecto
      params.query = query.value || defaultQuery;
      // Agrega la orientación al objeto de parámetros
      params.orientation = orientation.value;
  
      const options = {
        method: 'GET',
        url: uri,
        params: params,
        headers: {
          Authorization: apiKeyValue.value
        },
      };
  
      try {
        const response = await axios.request(options);
        return response.data[endpoint];
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return { query, searcher, apiKeyValue, orientation }
})
