<script setup lang="ts">
import { useMediaSearch } from '../composables/mediaSearchComposable';
const {
    groupedMedia,
    handleDragStart,
    startDownloadFile,
    isMediaDraggable,
    showLoader,
    isLoading,
    downloadedMediaIds,
    downloadSize,
    photoPreviewSize
  } = useMediaSearch('photos');

</script>
<template>
  <main>
    <div v-if="isLoading">No es posible cargar el contenido.</div>
    <div class="gallery">
      <template v-for="group in groupedMedia" :key="group.id">
        <div class="column">
          <template v-for="photo in group" :key="photo.id">
            <div class="image-container">
              <template v-if="showLoader.state && photo.id == showLoader.mediaId">
                <div class="loader-container">
                  <div class="loader"></div>
                  <p>Descargando...</p>
                </div>
              </template>

              <a target="_blank" rel="noopener"
                @dragstart="downloadedMediaIds.includes(photo.id.toString()) && handleDragStart($event, photo.src[downloadSize], photo.id)">
                <img :class="showLoader.state && photo.id == showLoader.mediaId ? 'loader-opacity' : ''"
                  :src="photo.src[photoPreviewSize]" :alt="photo.alt" :draggable="!isMediaDraggable(photo.id.toString())">
              </a>
              <div v-if="isMediaDraggable(photo.id.toString()) && photo.id != showLoader.mediaId">
                <a class="download-button" target="_blank" rel="noopener"
                  @click="startDownloadFile(photo.src[downloadSize], photo.id)">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAU0lEQVR4nO3QsQqAMAxF0ffXHdM/v+KgQ0qtaCxIc6BLh3ch0jJwMtAgTzRCnsgDij/LBdOHEXs0fjNir8YHkZjxTiR2/ADU/Z0fKRTBND2gv9oAVZTQEh7ZErUAAAAASUVORK5CYII=">
                </a>
              </div>
            </div>
          </template>
        </div>
      </template>

    </div>
  </main>
</template>
<style>
.loader-opacity {
  opacity: 40%;
}

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Centra horizontalmente */
  justify-content: center;
  /* Centra verticalmente */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Centra tanto vertical como horizontalmente */
  color: #FFFFFF;
}

.loader {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #34db9b;
  border-radius: 50%;
  width: 2em;
  height: 2em;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
  /* Espacio entre el loader y el texto */
}

p {
  margin: 0;
  /* Elimina el margen predeterminado del párrafo */
  font-size: 1em;
  /* Tamaño del texto */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}</style>
