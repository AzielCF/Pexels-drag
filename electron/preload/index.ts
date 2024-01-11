import { contextBridge, ipcRenderer } from 'electron'

// Agrega el event listener una sola vez cuando se carga el HTML
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.on('selectedDirectory', (event, selectedDirectory, typeFile) => {
    window.postMessage({ selectedDirectory, typeFile }, '*');
  });

  ipcRenderer.on('respuestaOnDirectoryStorage', (event, data) => {
    if (data.error) {
      console.error('Error al obtener la lista de archivos:', data.error);
    } else {
      if (data) {
        window.postMessage({ "savedFilesList": data }, '*');
      }
    }
  });
});

// Request the folder information from the main process
ipcRenderer.send('get-folders');

    // Listen for the response from the main process
    ipcRenderer.on('folders-obtained', (event, data) => {
      const { videosFolder, imagesFolder } = data;
      console.log(videosFolder)
      window.postMessage({ videosFolder, imagesFolder }, '*');
    });

// Json backup data
contextBridge.exposeInMainWorld('foldersObtained', async () => {
  const data = await ipcRenderer.invoke('get-folders')
  return data
})

contextBridge.exposeInMainWorld('electron', {
  startDrag: (fileURL, fileName, fileFormat, fileType, fileDirectorySave) => {
    ipcRenderer.send('ondragstart', fileURL, fileName, fileFormat, fileType, fileDirectorySave)
  },

  //  Cuando das click al boton descargar
  downloadFile: (fileURL, fileID, fileName, fileFormat, fileType, fileDirectorySave) => {
    ipcRenderer.send('onDownloadFile', fileURL, fileID, fileName, fileFormat, fileType, fileDirectorySave)
    console.log(fileName)
  },

  selectDirectory: (typeFile) => {
    ipcRenderer.send('onmodal', typeFile)
  },

  getDirectoryLocalStorage : (photos, videos) => {
    ipcRenderer.send('onDirectoryStorage', photos, videos)
  },
})

// Envia el envento de que ya se a descargado el archivo
ipcRenderer.on('file-downloaded', (event, fileName, filePath) => {
    // Ejecuta código en el DOM para notificar al usuario
    const customEvent = new CustomEvent('fileDownloaded', { detail: { fileName, filePath } });
    window.dispatchEvent(customEvent);
});

// Envia el envento de showLoader
ipcRenderer.on('showLoader', (event, state, fileID) => {
  // Ejecuta código en el DOM para notificar al usuario
  const customEvent = new CustomEvent('showLoader', { detail: { state, fileID } });
  window.dispatchEvent(customEvent);
});

contextBridge.exposeInMainWorld('respuestaOnDirectoryStorage', async () => {

})
