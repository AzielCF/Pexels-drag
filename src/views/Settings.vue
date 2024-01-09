<script setup lang="ts">
import { ref } from 'vue';

const folders = ref('')
const directoryPhotos = ref('');
const directoryVideos = ref('');

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
</script>

<template>
  <main>
    <h2>Ajustes</h2>
    <div>
      <span>Directorio fotos</span>
      <div class="section-directory">
        <input class="dark-input" v-model="directoryPhotos" placeholder="Directorio">
        <button class="btn-select" @click="selectDirectory('photos')">Seleccionar</button>
      </div>
    </div>
    <div>
      <span>Directorio vídeos</span>
      <div class="section-directory">
        <input class="dark-input" v-model="directoryVideos" placeholder="Directorio">
        <button class="btn-select" @click="selectDirectory('video')">Seleccionar</button>
      </div>
    </div>
  </main>
</template>

<style>
.section-directory {
  display: flex;
  gap: 10px;
}

.btn-select {
  background-color: rgb(54, 54, 54);
  color: white;
  box-shadow: none;
  height: 35px;
  border: 0;
  border-radius: 5px;
  cursor: pointer;
}
</style>