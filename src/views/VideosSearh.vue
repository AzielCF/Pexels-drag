<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia'
import { useSearchStore } from '../stores/search'

const store = useSearchStore();
const { query } = storeToRefs(store)
const { searcher } = store

const qualityVideoPrefer = 'hd';
const photos = ref([]);
const videos = ref([]);
const columnCount = ref(3);

const directoryVideosStorage = localStorage.getItem('directorySaveVideos');

const searchVideos = () => {
  searcher.videos({ query: query.value, per_page: 6 })
  .then((response) => {
    videos.value  = response
  })
  .catch((error) => {
    // Maneja los errores aquí
    console.error(error);
  });
};

const setupComponent = () => {
  updateColumnCount();
  window.addEventListener('resize', updateColumnCount);
  searchVideos();
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
  const totalVideos = videos.value.length;
  const groupSize = Math.ceil(totalVideos / columnCount.value);

  for (let i = 0; i < totalVideos; i += groupSize) {
    const group = videos.value.slice(i, i + groupSize);
    groups.push(group);
  }

  return groups;
});

const selectQuality = (videoId) => {
  const videoObj = videos.value.find((video) => video.id === videoId);

  if (videoObj && videoObj.video_files) {
    const videoObjQualitys = videoObj.video_files;
    let videoUrl;

    if (videoObj.width > videoObj.height) {
      // Video Horizontal
      videoUrl = videoObjQualitys.find((video) => video.quality == qualityVideoPrefer && (video.width == 1920 || video.width == 2048)).link;
    } else {
      // Video Vertical
      videoUrl = videoObjQualitys.find((video) => video.quality == qualityVideoPrefer && video.width < 1200).link;
    }

    return videoUrl;
  }
};

const handleDragStart = (event, fileURL, fileName) => {
  event.preventDefault();
  window.electron.startDrag(fileURL, fileName, ".mp4", "video", directoryVideosStorage);
};

const dragStart = (fileName) => {
  event.preventDefault();
  window.electron.startDrag(fileName);
}

</script>

<template>
  <main>

    <div class="gallery">
      <template v-for="group in groupedVideos" :key="group.id">
        <div class="column">
          <template v-for="video in group" :key="video.id">
            <div class="image-container">
              <a target="_blank" rel="noopener"  @dragstart="handleDragStart($event, selectQuality(video.id), video.id)" >
                <img :src="video.image" :alt="video.alt">
              </a>
            </div>
          </template>
        </div>
      </template>
    </div>
  </main>
</template>