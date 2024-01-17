<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'

const store = useSearchStore();
const { query } = storeToRefs(store)
const { searcher } = store

const qualityVideoPrefer = 'hd';
const videos: Ref<any> = ref([]);
const columnCount = ref(3); // Cuantas columnas máximo se verán

const directoryPhotosStorage = localStorage.getItem('directorySavePhotos');
const directoryVideosStorage = localStorage.getItem('directorySaveVideos');

const page = ref(1);
const isLoading = ref(false);

const searchVideos = (isFromInput = false) => {
  if (isLoading.value) return;

  // Si la búsqueda es desde un input, reinicia los resultados
  if (isFromInput) {
    videos.value = [];
    page.value = 1;
  }

  isLoading.value = true;

  searcher.videos({ query: query.value, page: page.value, per_page: 8 })
    .then((response: any) => {
      videos.value = [...videos.value, ...response];
      page.value += 1;
      isLoading.value = false;
    })
    .catch((error) => {
      // Maneja los errores aquí
      console.error(error);
    });
};


const selectQuality = (videoId: string) => {
  const videoObj = videos.value.find((video: any) => video.id === videoId);

  if (videoObj && videoObj.video_files) {
    const videoObjQualitys = videoObj.video_files;
    let videoUrl;

    if (videoObj.width > videoObj.height) {
      // Video Horizontal
      videoUrl = videoObjQualitys.find((video: any) => video.quality == qualityVideoPrefer && (video.width == 1920 || video.width == 2048)).link;
    } else {
      // Video Vertical
      videoUrl = videoObjQualitys.find((video: any) => video.quality == qualityVideoPrefer && video.width < 1200).link;
    }

    return videoUrl;
  }
};

const handleScroll = () => {
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  if (scrollY + windowHeight >= documentHeight - 200) {
    searchVideos();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  searchVideos(); // Carga las primeras fotos al montar el componente
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

////////////////////////////////////////////

const setupComponent = () => {
  updateColumnCount();
  window.addEventListener('resize', updateColumnCount);
  searchVideos(true);
};

onMounted(setupComponent);

watch(query, () => {
  console.log('actualizado desde videos');
  setupComponent();
});

const updateColumnCount = () => {
  if (window.innerWidth > 900) {
    columnCount.value = 3;
  } else {
    columnCount.value = 2;
  }
};

const groupedVideos = computed(() => {
  const groups = [];
  const totalPhotos = videos.value?.length;
  const groupSize = Math.ceil(totalPhotos / columnCount.value);

  for (let i = 0; i < totalPhotos; i += groupSize) {
    const group = videos.value?.slice(i, i + groupSize);
    groups.push(group);
  }
  return groups;
});

const handleDragStart = (event: Event, fileURL: string, fileID: string) => {
  event.preventDefault();
  const fileName = `${fileID}[${qualityVideoPrefer}]`;
  window.electron.startDrag(fileURL, fileName, ".mp4", "video", directoryVideosStorage);
};

const startDownloadFile = (fileURL: string, fileID: string) => {
  const fileName = `${fileID}[${qualityVideoPrefer}]`;
  window.electron.downloadFile(fileURL, fileID, fileName, ".mp4", "video", directoryVideosStorage)
};

const downloadedVideoIds: Ref<any> = ref([]);

//Obtiene los nombres(ID) de archivos del directorio de guardado
window.addEventListener('message', (event) => {
  const { savedFilesList } = event.data;
  downloadedVideoIds.value = savedFilesList.videos
    .filter((file: any) => file.includes('[') && file.includes(']')) // Filtrar los nombres de archivos que contienen []
    .map((file: any) => file.split('[')[0]); // Extraer el id, que es la parte del nombre del archivo antes de [
})

const isVideoDraggable = (id: number) => {
  return !downloadedVideoIds.value.includes(id)
}

// Escuchar el evento "fileDownloaded" (cuando se termina de descargar el archivo)
window.addEventListener('fileDownloaded', function (event: any) {
  const fileName = event.detail.fileName;
  const filePath = event.detail.filePath;
  refreshResults()
  // Puedes mostrar una notificación al usuario o realizar otras acciones en el DOM aquí
  console.log(`Archivo descargado: ${fileName}\nRuta: ${filePath}`);
});

const showLoader = ref({
  state: false,
  videoId: undefined
})

// Escuchar el evento "showLoader" (cuando se termina de descargar el archivo)
window.addEventListener('showLoader', function (event: any) {
  showLoader.value = {
    state: event.detail.state,
    videoId: event.detail.fileID
  }
});

const refreshResults = () => {
  window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)
}

</script>

<template>
  <main>
    <div v-if="isLoading">No es posible cargar el contenido.</div>
    <div class="gallery">
      <template v-for="group in groupedVideos" :key="group.id">
        <div class="column">
          <template v-for="video in group" :key="video.id">
            <div class="image-container">
              <template v-if="showLoader.state && video.id == showLoader.videoId">
                <div class="loader-container">
                  <div class="loader"></div>
                  <p>Descargando...</p>
                </div>
              </template>
              <a target="_blank" rel="noopener"
                @dragstart="downloadedVideoIds.includes(video.id.toString()) && handleDragStart($event, selectQuality(video.id), video.id)">
                <img :class="showLoader.state && video.id == showLoader.videoId ? 'loader-opacity' : ''"
                  :src="video.image" :alt="video.alt" :draggable="!isVideoDraggable(video.id.toString())">
              </a>
              <div v-if="isVideoDraggable(video.id.toString()) && video.id != showLoader.videoId">
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