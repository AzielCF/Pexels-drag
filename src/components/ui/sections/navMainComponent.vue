<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
    <nav class="flex place-content-center pb-6">
        <RouterLink to="/">Fotos</RouterLink>
        <RouterLink to="/videos">Vídeos</RouterLink>
        <RouterLink to="/settings">Ajustes</RouterLink>
    </nav>
</template>