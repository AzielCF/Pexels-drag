<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const apiKey = ref()
const errorMessage = ref('') // Mensaje de error

const applyPexelsApiKey = async () => {

    //Hacemos una url única con la fecha, ya que la busqueda en caché puede darnos problemas
    const url = 'https://api.pexels.com/v1/search?query=ocean'
    const uniqueUrl = `${url}&_=${Date.now()}`

    if (apiKey.value && apiKey.value.length >= 50) {
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
        errorMessage.value = 'Esto no es una API key' // Muestra el mensaje de error en la interfaz
    }
}
</script>

<template>
    <div class="section-input text-center">
        <input class="dark-input" v-model="apiKey" placeholder="Api Key">
        <div class="bg-[#2b2b2b] hover:bg-[#3f3f3f] h-[35px] shadow-none rounded-md cursor-pointer items-center justify-center flex" @click="applyPexelsApiKey()">Aplicar</div>
        <div class="text-red-500 mt-5">{{ errorMessage }}</div>
    </div>
</template>
