<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from './stores/search'
import { useRoute } from 'vue-router'

const store = useSearchStore()
const { query, enter } = storeToRefs(store)
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

  electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
})
</script>
<template>
  <header>
    <h1 class="logo">PEXELS DRAG</h1>
    <p>Sientase libre de arrastrar cada elemento a cualquier programa o carpeta deseada.</p>
    <div class="wrapper">
      <nav>
        <div class="search-bar">
          <input class="dark-input" v-model="queryInit" @keydown.enter="searcher" placeholder="Buscar imagenes / videos">
        </div>
        <RouterLink to="/">Fotos</RouterLink>
        <RouterLink to="/videos">Videos</RouterLink>
        <RouterLink to="/settings">Ajustes</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>