import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useSearchStore } from '../stores/search';

interface ShowLoader {
  state: boolean;
  mediaId: number | undefined;
}

export function useMediaSearch(mediaType: 'photos' | 'videos') {
  const store = useSearchStore();
  const { query, orientation } = storeToRefs(store);
  const { searcher } = store;

  const mediaItems = ref<any[]>([]);
  const columnCount = ref(3);
  const directoryStorage = localStorage.getItem(`directorySave${mediaType === 'photos' ? 'Photos' : 'Videos'}`);
  const page = ref(1);
  const isLoading = ref(false);

  const downloadSize = mediaType === 'photos' ? 'medium' : 'hd';
  const photoPreviewSize = "small"

  const searchMedia = (isFromInput = false) => {
    if (isLoading.value) return;

    if (isFromInput) {
      mediaItems.value = [];
      page.value = 1;
    }

    isLoading.value = true;

    const searchOptions = {
      page: page.value,
      per_page: mediaType === 'photos' ? 12 : 9,
    };

    searcher[mediaType]({ ...searchOptions })
      .then((response: any) => {
        mediaItems.value = [...mediaItems.value, ...response];
        page.value += 1;
        isLoading.value = false;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (scrollY + windowHeight >= documentHeight / 2) {
      searchMedia();
    }
  };

  const setupComponent = () => {
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    searchMedia(true);
  };

  const updateColumnCount = () => {
    columnCount.value = window.innerWidth > 900 ? 3 : 2;
  };

  const groupedMedia = computed(() => {
    const columns: Array<Array<any>> = Array.from({ length: columnCount.value }, () => []);
    const totalItems = mediaItems.value?.length;

    for (let i = 0; i < totalItems; i++) {
      const columnIndex = i % columnCount.value;
      columns[columnIndex].push(mediaItems.value[i]);
    }

    return columns;
  });

  const fileExtension = mediaType === 'photos' ? '.png' : '.mp4';
  const fileType = mediaType === 'photos' ? 'img' : 'video';
  
  const handleDragStart = (event: Event, fileURL: string, fileID: string) => {
    event.preventDefault();
    const fileName = `${fileID}[${downloadSize}]`;
    window.electron.startDrag(fileURL, fileName, fileExtension, fileType, directoryStorage);
  };

  const startDownloadFile = (fileURL: string, fileID: string) => {
    const fileName = `${fileID}[${downloadSize}]`;
    const fileExtension = mediaType === 'photos' ? '.png' : '.mp4';
    window.electron.downloadFile(fileURL, fileID, fileName, fileExtension, fileType, directoryStorage);
  };


  const selectQuality = (videoId: string) => {
    const videoObj = mediaItems.value.find((video: any) => video.id === videoId);
  
    if (videoObj && videoObj.video_files) {
      const videoObjQualitys = videoObj.video_files;
      let videoUrl;
  
      if (videoObj.width > videoObj.height) {
        // Video Horizontal
        videoUrl = videoObjQualitys.find((video: any) => video.quality == downloadSize && (video.width == 1920 || video.width == 2048)).link;
      } else {
        // Video Vertical
        videoUrl = videoObjQualitys.find((video: any) => video.quality == downloadSize && video.width < 1200).link;
      }
  
      return videoUrl;
    }
  };

  const downloadedMediaIds = ref<number[]>([]);

  window.addEventListener('message', (event) => {
    const { savedFilesList } = event.data;
    downloadedMediaIds.value = savedFilesList[mediaType]
    .filter((file: any) => file.includes('[') && file.includes(']')) // Filtrar los nombres de archivos que contienen []
    .map((file: any) => file.split('[')[0]); // Extraer el id, que es la parte del nombre del archivo antes de [

  });

  const isMediaDraggable = (id: number) => {
    return !downloadedMediaIds.value.includes(id);
  };

  window.addEventListener('fileDownloaded', (event: any) => {
    const fileName = event.detail.fileName;
    const filePath = event.detail.filePath;
    refreshResults();
    console.log(`Archivo descargado: ${fileName}\nRuta: ${filePath}`);
  });

  const showLoader = ref<ShowLoader>({
    state: false,
    mediaId: undefined,
  });

  window.addEventListener('showLoader', (event: any) => {
    showLoader.value = {
      state: event.detail.state,
      mediaId: event.detail.fileID,
    };
  });

  const refreshResults = () => {
    window.electron.getDirectoryLocalStorage(directoryStorage);
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    searchMedia();
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  watch([query, orientation], () => {
    setupComponent();
  }, { immediate: true });
  
  onMounted(setupComponent);

  return {
    downloadedMediaIds,
    downloadSize,
    photoPreviewSize,
    isLoading,
    mediaItems,
    columnCount,
    groupedMedia,
    handleDragStart,
    startDownloadFile,
    isMediaDraggable,
    refreshResults,
    selectQuality,
    showLoader,
  };
}
