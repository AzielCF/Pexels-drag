
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import './style.css'

const app = createApp(App)

declare global {
    interface Window { electron: any, foldersObtained: any}
}

const directoryPhotosStorage = localStorage.getItem('directorySavePhotos');
const directoryVideosStorage = localStorage.getItem('directorySaveVideos');
window.electron.getDirectoryLocalStorage(directoryPhotosStorage, directoryVideosStorage)

app.use(createPinia())
app.use(router)

app.mount('#app')

