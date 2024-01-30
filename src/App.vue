<script setup lang="ts">
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from './stores/search'
import { useRoute } from 'vue-router'
import CustomTitleBarComponent from './components/customTitleBarComponent.vue'
import PopupApikeyComponent from './components/ui/sections/popupApikeyComponent.vue'
import InputSearcherComponent from './components/inputSearcherComponent.vue'
import HeaderMainComponent from './components/ui/sections/headerMainComponent.vue'
import navMainComponent from './components/ui/sections/navMainComponent.vue'

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

  <template v-if="apiKeyValue">
    <HeaderMainComponent />
    <InputSearcherComponent :routeState="route" />
    <navMainComponent />
    <RouterView class="flex place-content-center flex-wrap text-center" />
  </template>
</template>