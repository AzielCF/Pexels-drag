<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from './stores/search'
import { useRoute } from 'vue-router'
import CustomTitleBarComponent from './components/customTitleBarComponent.vue'
import PopupApikeyComponent from './components/ui/sections/popupApikeyComponent.vue'
import InpurSearcherComponent from './components/inpurSearcherComponent.vue'

const store = useSearchStore()
const { apiKeyValue } = storeToRefs(store)

const route = useRoute()
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')

// Esta logica mantiene el estado del medio descargado, para no volver a descargar
watch(() => route.path, (newPath, oldPath) => {
  // Aquí puedes realizar acciones específicas cuando se cambie de página
  console.log(`Cambiado de ${oldPath} a ${newPath}`)
  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
})
</script>

<template>
  <CustomTitleBarComponent />
  <PopupApikeyComponent v-if="!apiKeyValue" />

  <header class="pt-10 pb-8 ">
    <h1 class="text-4xl">PEXELS DRAG</h1>
    <p class="text-md pt-4">Sientase libre de arrastrar cada elemento a cualquier programa o carpeta deseada.</p>
  </header>
  <InpurSearcherComponent :routeState="route"/>
  <nav class="flex place-content-center">
    <div class="pb-6">
      <RouterLink to="/">Fotos</RouterLink>
      <RouterLink to="/videos">Vídeos</RouterLink>
      <RouterLink to="/settings">Ajustes</RouterLink>
    </div>
  </nav>

  <RouterView class="flex place-content-center flex-wrap text-center" v-if="apiKeyValue" />
</template>