import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { release } from 'node:os'
import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 

const fs = require('fs')
const https = require('https')
const axios = require('axios');
const os = require('os');
const path = require('path');

import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#333333',
      symbolColor: '#fff',
      height: 40
    },
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      //nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      //contextIsolation: true,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344

}


const iconName = "drag-and-drop.png"
const icon = fs.createWriteStream(iconName)

https.get('https://img.icons8.com/ios/50/drag-and-drop.png', (response) => {
  response.pipe(icon)
})

app.whenReady().then(createWindow)


const createFolderIfNotExists = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
};

// Obtenemos las carpetas defauld de videos y pictures  
const videosFolder = path.join(os.homedir(), 'Videos', 'Pexels-drag');
const imagesFolder = path.join(os.homedir(), 'Pictures', 'Pexels-drag');

createFolderIfNotExists(videosFolder);
createFolderIfNotExists(imagesFolder);

ipcMain.handle('get-folders', () => {
  // Devolver la información de las carpetas al proceso del renderer
  return { videosFolder, imagesFolder };
});


ipcMain.on('onDownloadFile', async (event, fileURL, fileID, fileName, fileFormat, fileType, fileDirectorySave) => {

  // Define el path del archivo
  let filePath;

  if(fileType === "img" && !fileDirectorySave){
    filePath = path.join(imagesFolder, fileName + fileFormat);
  } else if (fileType === "img" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  if(fileType === "video" && !fileDirectorySave) {
    filePath = path.join(videosFolder, fileName + fileFormat);
  } else if (fileType === "video" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  // Comprueba si el archivo ya existe
  if (!fs.existsSync(filePath)) {

    //El loader se motrará mientras descarga el archivo
    event.sender.send('showLoader', true, fileID);

    // Si el archivo no existe, descárgalo
    try {
      const response = await axios.get(fileURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(response.data));
      console.log(`El archivo se encuentra descargado, esta listo para arrastrar.`);
      
      // Notificar al proceso de representación (renderer) que la descarga se ha completado
      event.sender.send('file-downloaded', fileName, filePath); // Envía el nombre del archivo y su ruta
    } catch (error) {
      console.error(`Error al descargar el archivo: ${error.message}`);
    } finally {
      // Ocultar el círculo de carga (ya sea después de la descarga exitosa o en caso de error)
      event.sender.send('showLoader', false, fileID);
    }
  } else {
    console.log(`El archivo ${fileName + fileFormat} ya existe, no se descargará de nuevo.`);
  }

});

ipcMain.on('ondragstart', async (event, fileURL, fileName, fileFormat, fileType, fileDirectorySave) => {
  // Define el path del archivo
  let filePath;

  if(fileType === "img" && !fileDirectorySave){
    filePath = path.join(imagesFolder, fileName + fileFormat);
  } else if (fileType === "img" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  if(fileType === "video" && !fileDirectorySave) {
    filePath = path.join(videosFolder, fileName + fileFormat);
  } else if (fileType === "video" && fileDirectorySave) { 
    filePath = path.join(fileDirectorySave, fileName + fileFormat);
  }

  // Comprueba si el archivo ya existe
  if (!fs.existsSync(filePath)) {
    // Si el archivo no existe, descárgalo
    // const response = await axios.get(fileURL, { responseType: 'arraybuffer' });
    // fs.writeFileSync(filePath, Buffer.from(response.data));
    console.log(`El archivo no se encuentra, descarguelo para arrastrar.`);
  } else {
    console.log(`El archivo ${fileName + fileFormat} ya existe, no se descargará de nuevo.`);
  }

  event.sender.startDrag({
    file: filePath,
    icon: iconName
  });
});


interface ResponseData {
  photos?: string[];
  videos?: string[];
  error?: any;
}

// Esta funcion devuelve un json
// con los nombres de todos los archivos en el directorio
ipcMain.on('onDirectoryStorage', async (event, photosDirectory, videosDirectory) => {
  const response: ResponseData = {}; // Objeto de respuesta

  // Comprobar si photosDirectory y videosDirectory están definidos y no son cadenas vacías
  if (!photosDirectory || photosDirectory.trim() === '') {
    photosDirectory = imagesFolder; // Usar el valor de imagesFolder si es vacío
  }

  if (!videosDirectory || videosDirectory.trim() === '') {
    videosDirectory = videosFolder; // Usar el valor de videosFolder si es vacío
  }

  // Ahora, puedes realizar la lectura de directorio con las rutas actualizadas
  fs.readdir(photosDirectory, (err, photoFiles) => {
    if (err) {
      response.error = err;
    } else {
      response.photos = photoFiles;

      // Realizar la lectura del directorio de videos
      fs.readdir(videosDirectory, (err, videoFiles) => {
        if (err) {
          response.error = err;
        } else {
          response.videos = videoFiles;
        }

        // Enviar la respuesta una vez que tengas ambos conjuntos de datos
        event.reply('respuestaOnDirectoryStorage', response);
      });
    }
  });
});



// Función para mostrar el cuadro de diálogo de selección de directorio
ipcMain.on('onmodal', async (event, typeFile) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then(result => {
    const selectedDirectory = result.filePaths[0];
    event.sender.send('selectedDirectory', selectedDirectory, typeFile);
  }).catch(err => {
    console.log(err);
  });
});
// Llamar a la función cuando sea necesario



app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
