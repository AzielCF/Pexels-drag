<script setup lang="ts">
defineProps({
    valueName: String
})
</script>

<template>
    <div
        class="bg-[#2b2b2b] hover:bg-[#3f3f3f] h-[42px] px-4 shadow-none rounded-sm cursor-pointer text-gray-50 flex items-center justify-center">
        <div><slot name="icon"></slot></div>{{ valueName }}
    </div>
</template>