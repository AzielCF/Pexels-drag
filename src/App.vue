<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from './stores/search'
import { useRoute } from 'vue-router'
import CustomTitleBarComponent from './components/customTitleBarComponent.vue'
import PopupApikeyComponent from './components/ui/sections/popupApikeyComponent.vue'

const store = useSearchStore()
const { query, apiKeyValue } = storeToRefs(store)
const queryInit = ref('')
const searcher = () => {
  store.query = queryInit.value
  // Lógica para buscar videos
  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
  console.log('Buscar videos:', query.value);
  // Resto de tu código para buscar videos
}

const route = useRoute()

// Puedes utilizar una referencia para mantener un seguimiento de la página actual

const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')
// Utiliza watch para detectar cambios en la propiedad $route
watch(() => route.path, (newPath, oldPath) => {
  // Aquí puedes realizar acciones específicas cuando se cambie de página
  console.log(`Cambiado de ${oldPath} a ${newPath}`)

  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
})
</script>

<template>
  <CustomTitleBarComponent/>
  <PopupApikeyComponent v-if="!apiKeyValue"/>

  <header class="pt-10">
    <h1 class="text-4xl">PEXELS DRAG</h1>
    <p class="text-md pt-4">Sientase libre de arrastrar cada elemento a cualquier programa o carpeta deseada.</p>
    <div class="wrapper">
      <nav>
        <div class="search-bar">
          <input class="dark-input" v-model="queryInit" @keydown.enter="searcher" placeholder="Buscar imágenes / vídeos">
        </div>
        <div style="padding: 15px 0px 20px 0px;">
          <RouterLink to="/">Fotos</RouterLink>
          <RouterLink to="/videos">Vídeos</RouterLink>
          <RouterLink to="/settings">Ajustes</RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <RouterView v-if="apiKeyValue"/>
</template>