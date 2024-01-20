<script setup lang="ts">
import { useMediaSearch } from '../composables/mediaSearchComposable';
const {
    groupedMedia,
    handleDragStart,
    startDownloadFile,
    isMediaDraggable,
    selectQuality,
    showLoader,
    isLoading,
    downloadedMediaIds
  } = useMediaSearch('videos');
</script>

<template>
  <main>
    <div v-if="isLoading">No es posible cargar el contenido.</div>
    <div class="gallery">
      <template v-for="group in groupedMedia" :key="group.id">
        <div class="column">
          <template v-for="video in group" :key="video.id">
            <div class="image-container">
              <template v-if="showLoader.state && video.id == showLoader.mediaId">
                <div class="loader-container">
                  <div class="loader"></div>
                  <p>Descargando...</p>
                </div>
              </template>
              <a target="_blank" rel="noopener"
                @dragstart="downloadedMediaIds.includes(video.id.toString()) && handleDragStart($event, selectQuality(video.id), video.id)">
                <img :class="showLoader.state && video.id == showLoader.mediaId ? 'loader-opacity' : ''"
                  :src="video.image" :alt="video.alt" :draggable="!isMediaDraggable(video.id.toString())">
              </a>
              <div v-if="isMediaDraggable(video.id.toString()) && video.id != showLoader.mediaId">
                <a class="download-button" target="_blank" rel="noopener"
                  @click="startDownloadFile(selectQuality(video.id), video.id)"><img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAU0lEQVR4nO3QsQqAMAxF0ffXHdM/v+KgQ0qtaCxIc6BLh3ch0jJwMtAgTzRCnsgDij/LBdOHEXs0fjNir8YHkZjxTiR2/ADU/Z0fKRTBND2gv9oAVZTQEh7ZErUAAAAASUVORK5CYII="></a>
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>
  </main>
</template>