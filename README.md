# Pexels Drag: Aplicación de Descarga de Medios con Electron, Vue 3 y Vite

## Descripción

Pexels Drag es una aplicación de escritorio construida con Electron, Vue 3 y Vite. Utiliza la API de Pexels para permitir a los usuarios descargar imágenes y videos, guardarlos en un directorio definido y arrastrar las imágenes a cualquier programa de forma fácil.

> [!WARNING]
> Este repositorio contiene una versión más ligera del nuevo proyecto, [Drag Media](https://github.com/AzielCF/Drag-media). Dado que [Drag Media](https://github.com/AzielCF/Drag-media) es más completo y suficientemente distinto, este repositorio dejará de recibir mantenimiento. No obstante, este proyecto aún funciona y está disponible para su uso. De igual forma se recomienda usar [Drag Media](https://github.com/AzielCF/Drag-media), ya que tiene mejores características y es más versátil.

#### Tecnologías Utilizadas
<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" height="40" alt="vuejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg" height="40" alt="electron logo"  />
</div>

## Screenshots

<div align="center">
  <img height="400" src="https://res.cloudinary.com/dktwu41vm/image/upload/f_auto,q_auto/rdzlisowbpes52c47yem"  />
</div>

## Características

- **Descarga de medios**: Los usuarios pueden descargar imágenes y videos desde la web utilizando la API de Pexels.
- **Guardado de medios**: Los medios descargados se guardan en un directorio definido por el usuario.
- **Arrastrar y soltar**: Los usuarios pueden arrastrar fácilmente las imágenes descargadas a cualquier programa.

## Cómo Empezar

1. Clona el repositorio.
2. Instala las dependencias con `npm install`.
3. Configura tu clave API de Pexels en un archivo `.env`.

```javascript
VITE_PEXELS_API_KEY="YOUR_API"
```
4. Inicia la aplicación con `npm run dev`.

> [!WARNING]
> Puede que haya un problema si no contiene la carpeta "/Pictures" en su usuario de windows por defecto, ya que puede estar alojado en onedrive y electron no abre esa carpeta, solo créela y estará solucionado. Lo resolveré pronto.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o realiza un pull request.
