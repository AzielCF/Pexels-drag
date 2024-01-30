<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiKey = ref('')
const errorMessage = ref('') // Mensaje de error
const isApiKeyValid = ref(false)
const showApiKey = ref(false)
const isLoading = ref(false)
const successMessage = ref('')

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

  // Resetear los mensajes
  errorMessage.value = ''
  successMessage.value = ''
  
  if (isValidApiKey()) {
    // Iniciar la carga
    isLoading.value = true;

    // Realiza una solicitud a la API para validar la API key
    try {
      const response = await axios.get(uniqueUrl, {
        headers: {
          Authorization: apiKey.value
        }
      })

      // Si la solicitud es exitosa, guarda la API key en el localStorage y recarga la página
      if (response.status === 200) {
        localStorage.setItem('PEXELS_API_KEY', apiKey.value);
        
        // Mostrar mensaje de éxito
        successMessage.value = 'API key válida. Accediendo...';
        setTimeout(() => {
          // Limpiar mensajes y cargar la página después de 2-3 segundos
          successMessage.value = '';
          isLoading.value = false;
          location.reload();
        }, 2000);
      }
    } catch (error) {
      errorMessage.value = 'API key inválida, no es posible conectar.'; // Muestra el mensaje de error en la interfaz
      isLoading.value = false;
    }
  } else {
    errorMessage.value = 'Esto no es una API key válida'; // Muestra el mensaje de error en la interfaz
    isLoading.value = false;
  }
}

const pasteFromClipboard = async () => {
  // Lógica para pegar desde el portapapeles
  const textFromClipboard = await navigator.clipboard.readText()
  apiKey.value = textFromClipboard
  applyPexelsApiKey()
}

const toggleShowApiKey = () => {
  // Lógica para mostrar u ocultar la clave
  showApiKey.value = !showApiKey.value
}

onMounted(() => {
  // Agregar un event listener para el evento keydown
  window.addEventListener('keydown', handleKeyDown)
})

const handleKeyDown = (event: KeyboardEvent) => {
  // Verificar si se presionaron las teclas Ctrl + Z
  if (event.ctrlKey && event.key === 'z') {
    // Resetear el contenido del input
    apiKey.value = ''
  }
}
</script>

<template>
  <div class="section-input flex max-w-screen-sm mx-auto">
    <input class="dark-input" v-model="apiKey" placeholder="Api Key" @input="applyPexelsApiKey()"
      :type="showApiKey ? 'text' : 'password'">
    <div class="bg-[#2b2b2b] hover:bg-[#3f3f3f] h-[43px] shadow-none rounded-sm cursor-pointer items-center flex justify-center px-2 mx-1"
      @click="pasteFromClipboard">
      Pegar
    </div>
    <div class="bg-[#2b2b2b] hover:bg-[#3f3f3f] h-[43px] shadow-none rounded-sm cursor-pointer items-center flex justify-center px-2"
      @click="toggleShowApiKey">
      {{ showApiKey ? 'Ocultar' : 'Mostrar' }}
    </div>
  </div>
  <div class="text-red-500 mt-5 text-center" v-show="apiKey.trim() !== ''">{{ errorMessage }}</div>
  <div class="text-green-500 mt-5 text-center" v-show="successMessage !== ''">{{ successMessage }}</div>
  <div v-show="isLoading" class="text-center mt-3">
    <span class="animate-spin">⚙️</span> Validando...
  </div>
</template>
