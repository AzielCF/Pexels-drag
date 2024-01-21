<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'
import ButtonComponent from './ui/elemets/buttonComponent.vue'

const store = useSearchStore()
const { query } = storeToRefs(store)
const queryInit = ref('')
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')

const searcher = () => {
  query.value = queryInit.value
  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
}

defineProps({
    routeState: Object
})
</script>
<template>
    <div class="flex search-bar z-50 bg-[#1d1d1d] h-16 items-center"
        :class="routeState?.name == 'home' || routeState?.name == 'videos' ? 'sticky top-9 ' : null">
        <input class="dark-input h-11" v-model="queryInit" @keydown.enter="searcher" placeholder="Buscar imágenes / vídeos">
        <ButtonComponent class="h-11 ml-3" valueName="Filtros" />
    </div>
</template>