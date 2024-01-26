<script setup lang="ts">
</script>
<template>
    <div class="drag-title-bar fixed flex h-[40px] bg-[#333333] w-screen left-0 top-0 items-center">   
        <div class="px-4 text-lg">Pexels drag</div>
    </div>
</template>
<style>
.drag-title-bar{
    -webkit-app-region: drag;
    z-index: 9999;
}
</style>