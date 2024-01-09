<<<<<<< HEAD
import './assets/main.css'
=======
import { createApp } from 'vue'
import App from './App.vue'

import './style.css'

import './demos/ipc'
// If you want use Node.js, the`nodeIntegration` needs to be enabled in the Main process.
// import './demos/node'
>>>>>>> 19995fcc1ff15259a0fc01b5ca03840f8b1f3f18

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

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
