<script setup lang="ts">
import inputApikeyComponent from '../../inputApikeyComponent.vue'

</script>
<template>
    <div class="configApiPopup flex flex-col items-center justify-center">
        <header class="w-full py-5">
            <h1 class="text-4xl">PEXELS DRAG</h1>
            <h3 class="text-md pt-2">¡Bienvenido, para empezar ingrese su <a target="_blank"
                    href="https://www.pexels.com/es-es/api/">Api Key de PEXELS</a> para funcionar!</h3>
        </header>
        <main class="w-full">
            <inputApikeyComponent/>
        </main>
    </div>
</template>