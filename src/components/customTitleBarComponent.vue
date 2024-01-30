<script setup lang="ts">
import logo from '../components/ui/icons/logo.vue'
</script>
<template>
    <div class="drag-title-bar fixed flex h-[40px] bg-[#333333] w-screen left-0 top-0 items-center">         
        <div class="flex flex-wrap items-center px-4 text-lg"><logo class="h-5 pr-2"/>Pexels drag</div>
    </div>
</template>
<style>
.drag-title-bar{
    -webkit-app-region: drag;
    z-index: 9999;
}
</style>