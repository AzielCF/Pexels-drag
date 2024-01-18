<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'

const store = useSearchStore();
const { query } = storeToRefs(store)
const { searcher } = store

const photos: Ref<any> = ref([]);
const columnCount = ref(3); // Cuantas columnas máximo se verán
const directoryPhotosStorage = localStorage.getItem('directorySavePhotos');
const directoryVideosStorage = localStorage.getItem('directorySaveVideos');

const photoDonwloadSize = "medium"
const photoPreviewSize = "small"

const page = ref(1);
const isLoading = ref(false);

/* const searchPhotos = () => {
  searcher.photos({ query: query.value, page: 1, per_page: 12 }).then(response => {
    photos.value = response;
  });
};
*/

const searchPhotos = (isFromInput = false) => {
  if (isLoading.value) return;

  // Si la búsqueda es desde un input, reinicia los resultados
  if (isFromInput) {
    photos.value = [];
    page.value = 1;
  }

  isLoading.value = true;

  searcher.photos({ query: query.value, page: page.value, per_page: 12 })
    .then((response: any) => {
      photos.value = [...photos.value, ...response];
      page.value += 1;
      isLoading.value = false;
    })
    .catch((error) => {
      // Maneja los errores aquí
      console.error(error);
    });
};


const handleScroll = () => {
  const scrollY = window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;
  const windowHeight = window.innerHeight;

  if (scrollY + windowHeight >= documentHeight - 200) {
    searchPhotos();
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  searchPhotos(); // Carga las primeras fotos al montar el componente
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

////////////////////////////////////////////

const setupComponent = () => {
  updateColumnCount();
  window.addEventListener('resize', updateColumnCount);
  searchPhotos(true);
};

onMounted(setupComponent);

watch(query, () => {
  console.log('actualizado desde fotos');
  setupComponent();
});

const updateColumnCount = () => {
  if (window.innerWidth > 900) {
    columnCount.value = 3;
  } else {
    columnCount.value = 2;
  }
};

const groupedPhotos = computed(() => {
  const groups = [];
  const totalPhotos = photos.value?.length;
  const groupSize = Math.ceil(totalPhotos / columnCount.value);

  for (let i = 0; i < totalPhotos; i += groupSize) {
    const group = photos.value?.slice(i, i + groupSize);
    groups.push(group);
  }
  return groups;
});

const handleDragStart = (event: Event, fileURL: string, fileID: string) => {
  event.preventDefault();
  const fileName = `${fileID}[${photoDonwloadSize}]`;
  window.electron.startDrag(fileURL, fileName, ".png", "img", directoryPhotosStorage)
};

const startDownloadFile = (fileURL: string, fileID: string) => {
  const fileName = `${fileID}[${photoDonwloadSize}]`;
  window.electron.downloadFile(fileURL, fileID, fileName, ".png", "img", directoryPhotosStorage)
};

const downloadedPhotoIds: Ref<any> = ref([]);

//Obtiene los nombres(ID) de archivos del directorio de guardado
window.addEventListener('message', (event) => {
  const { savedFilesList } = event.data;
  downloadedPhotoIds.value = savedFilesList.photos
    .filter((file: any) => file.includes('[') && file.includes(']')) // Filtrar los nombres de archivos que contienen []
    .map((file: any) => file.split('[')[0]); // Extraer el id, que es la parte del nombre del archivo antes de [
})

const isPhotoDraggable = (id: number) => {
  return !downloadedPhotoIds.value.includes(id)
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
  photoId: undefined
})

// Escuchar el evento "showLoader" (cuando se termina de descargar el archivo)
window.addEventListener('showLoader', function (event: any) {
  showLoader.value = {
    state: event.detail.state,
    photoId: event.detail.fileID
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
      <template v-for="group in groupedPhotos" :key="group.id">
        <div class="column">
          <template v-for="photo in group" :key="photo.id">
            <div class="image-container">
              <template v-if="showLoader.state && photo.id == showLoader.photoId">
                <div class="loader-container">
                  <div class="loader"></div>
                  <p>Descargando...</p>
                </div>
              </template>

              <a target="_blank" rel="noopener"
                @dragstart="downloadedPhotoIds.includes(photo.id.toString()) && handleDragStart($event, photo.src[photoDonwloadSize], photo.id)">
                <img :class="showLoader.state && photo.id == showLoader.photoId ? 'loader-opacity' : ''"
                  :src="photo.src[photoPreviewSize]" :alt="photo.alt" :draggable="!isPhotoDraggable(photo.id.toString())">
              </a>
              
              <div v-if="isPhotoDraggable(photo.id.toString()) && photo.id != showLoader.photoId">
                <a class="download-button" target="_blank" rel="noopener"
                  @click="startDownloadFile(photo.src[photoDonwloadSize], photo.id)">
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
