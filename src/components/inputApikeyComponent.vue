<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const apiKey = ref('')
const errorMessage = ref('') // Mensaje de error
const isApiKeyValid = ref(false)

const isValidApiKey = () => {
  // Verifica si la API key tiene al menos 50 caracteres y contiene al menos una letra mayúscula, una letra minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/;
  isApiKeyValid.value = apiKey.value.length >= 50 && regex.test(apiKey.value);
  return isApiKeyValid.value;
}

const applyPexelsApiKey = async () => {
  // Hacemos una url única con la fecha, ya que la búsqueda en caché puede darnos problemas
  const url = 'https://api.pexels.com/v1/search?query=ocean'
  const uniqueUrl = `${url}&_=${Date.now()}`

  if (isValidApiKey()) {
    // Realiza una solicitud a la API para validar la API key
    try {
      const response = await axios.get(uniqueUrl, {
        headers: {
          Authorization: apiKey.value
        }
      })

      // Si la solicitud es exitosa, guarda la API key en el localStorage y recarga la página
      if (response.status === 200) {
        localStorage.setItem('PEXELS_API_KEY', apiKey.value)
        location.reload()
      }
    } catch (error) {
      errorMessage.value = 'API key inválida.' // Muestra el mensaje de error en la interfaz
    }
  } else {
    errorMessage.value = 'Esto no es una API key válida' // Muestra el mensaje de error en la interfaz
  }
}
</script>


<template>
  <div class="section-input text-center">
    <input class="dark-input" v-model="apiKey" placeholder="Api Key" @input="applyPexelsApiKey()">
    <div class="text-red-500 mt-5" v-show="apiKey">{{ errorMessage }}</div>
  </div>
</template>
