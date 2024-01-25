<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'
import ButtonComponent from './ui/elemets/buttonComponent.vue'
import selectorComponent from './ui/elemets/selectorComponent.vue'

const store = useSearchStore()
const { query, orientation } = storeToRefs(store)
const queryInit = ref('')
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos')
const directoryVideosStorage = localStorage.getItem('directorySaveVideos')

// Obtén el valor almacenado en localStorage o utiliza el valor por defecto 'undefined'
const storedOrientation = localStorage.getItem('storedOrientation')

// Asigna el valor almacenado o el valor por defecto a la referencia 'orientation'
orientation.value = (storedOrientation === null || storedOrientation === "undefined") ? undefined : storedOrientation as "landscape" | "portrait" | "square"

const searcher = () => {
    query.value = queryInit.value
    window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
}

defineProps({
    routeState: Object
})

const openOptions = ref(false)

const orientationOptions = [
    { name: 'Todas las orientaciones', value: undefined },
    { name: 'Horizontal', value: 'landscape' },
    { name: 'Vertical', value: 'portrait' },
    { name: 'Cuadrado', value: 'square' }
]

// Observa cambios en 'orientation' y guarda el valor en localStorage
watch(orientation, () => {
    localStorage.setItem('storedOrientation', orientation.value as string)
    searcher()
})
</script>

<template>
    <div class="search-bar z-50 bg-[#1d1d1d] "
        :class="routeState?.name == 'home' || routeState?.name == 'videos' ? 'sticky top-9 ' : null">
        <div class="flex items-center h-16">
            <input class="dark-input h-11" v-model="queryInit" @keydown.enter="searcher"
                placeholder="Buscar imágenes / vídeos">
            <ButtonComponent @click.stop="openOptions = !openOptions" class="h-11 ml-3" valueName="Opciones">
                <template #icon>
                    <svg :class="{ 'rotate-180': openOptions }" class="mr-2 h-4 w-4 text-white transform transition duration-200"
                        xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 512 512" fill="currentColor">
                        <path
                            d="M512 125.62v4.72c-1.74 13.5-12.27 23.24-25.99 23.24H25.65c-13.5 0-23.88-9.95-25.65-23.19v-4.91c1.03-7.52 4.4-13.48 10.1-17.88 6.02-4.63 11.92-5.25 20.16-5.24 150.28.06 299.94.08 448.99.05 4.39 0 9.24-.32 13.26.78 11.02 3.01 17.52 10.49 19.49 22.43Z" />
                        <rect x="76.89" y="230.43" width="358.22" height="51.14" rx="25.18" />
                        <rect x="179.41" y="358.48" width="153.18" height="51.02" rx="24.66" />
                    </svg>
                </template>
            </ButtonComponent>
        </div>
        <div class="flex w-5/12  pb-4" v-show="openOptions">
            <selectorComponent :options="orientationOptions" v-model="orientation"/>
        </div>
    </div>
</template>
