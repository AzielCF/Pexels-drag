<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'
import buttonComponent from '../components/ui/elemets/buttonComponent.vue';

const store = useSearchStore();
const { apiKeyValue } = storeToRefs(store)

const directoryPhotos = ref('');
const directoryVideos = ref('');

if (!apiKeyValue.value) {
  apiKeyValue.value = localStorage.getItem('PEXELS_API_KEY');
}

// --------------------------------

const directoryPhotosStorage = localStorage.getItem('directorySavePhotos');
const directoryVideosStorage = localStorage.getItem('directorySaveVideos');

const selectDirectory = (type: string) => {
  if (type == "photos") {
    window.electron.selectDirectory(type);
  } else {
    window.electron.selectDirectory(type);
  }
}

  ; (async () => {

    //Se obtiene del preload el contextBridge foldersObtained()
    const foldersObj = await window.foldersObtained();


    // Si no hay el folder custom en local storage, opta el directorio defauld 
    directoryPhotos.value = directoryPhotosStorage ?? foldersObj.imagesFolder;
    directoryVideos.value = directoryVideosStorage ?? foldersObj.videosFolder;



  })()

// Escucha el evento despues de seleccionar la carpeta
window.addEventListener('message', (event) => {
  const { selectedDirectory, typeFile } = event.data;
  if (!selectedDirectory) {
    return
  }

  // Verificar cuál input debe actualizarse según el tipo
  if (typeFile == "photos") {
    directoryPhotos.value = selectedDirectory;
    localStorage.setItem('directorySavePhotos', selectedDirectory);
  } else {
    directoryVideos.value = selectedDirectory;
    localStorage.setItem('directorySaveVideos', selectedDirectory);
  }
})


const applyPexelsApiKey = () => {
  if(apiKeyValue.value){
    localStorage.setItem('PEXELS_API_KEY', apiKeyValue.value)
  } else {
    console.error('Campo sin valor.')
  }
}
</script>

<template>
  <main>
    <h2 class="text-2xl">Ajustes</h2>

    <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />

    <div class="section-input">
      <label>Apikey</label>
      <div class="section-directory">
        <input class="dark-input" type="password" v-model="apiKeyValue" placeholder="Api Key">
        <buttonComponent @click="applyPexelsApiKey()" valueName="Aplicar"/>
      </div>
    </div>

    <div style="border-bottom: 1px solid #7a7a7a; margin: 20px 0px 20px 0px;" />

    <div class="section-input">
      <label>Directorio fotos</label>
      <div class="section-directory">
        <input class="dark-input" v-model="directoryPhotos" placeholder="Directorio">
        <buttonComponent @click="selectDirectory('photos')" valueName="Seleccionar"/>
      </div>
    </div>
    <div class="section-input">
      <label>Directorio vídeos</label>
      <div class="section-directory">
        <input class="dark-input" v-model="directoryVideos" placeholder="Directorio">
        <buttonComponent @click="selectDirectory('video')" valueName="Seleccionar"/>
      </div>
    </div>
  </main>
</template>
