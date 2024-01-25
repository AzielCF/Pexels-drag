<template>
    <div class="relative inline-block text-left" @click="closeDropdown" ref="dropdown">
      <div>
        <div @click.stop="open = !open" type="button"
          class="items-center inline-flex justify-center w-full rounded-sm px-4 py-2 bg-[#2b2b2b] hover:bg-[#3f3f3f] text-sm font-medium text-white focus:outline-none cursor-pointer"
          id="options-menu" aria-haspopup="true" :aria-expanded="open">
          <span class="mr-10">{{ selectedOption.name || 'Opciones' }}</span>
          <svg :class="{ 'rotate-180': open }" class="-mr-1 ml-2 h-4 w-4 transform transition duration-200"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="currentColor"
              d="M512 145.32v2.7c-.74 6.53-3.39 11.96-7.95 16.28-75.9 71.92-151.81 143.83-227.72 215.74-3.89 3.68-6.82 6.06-8.81 7.13-7.01 3.78-16.02 3.81-23.01.02-1.99-1.07-5.03-3.54-9.12-7.41C159.57 307.96 83.76 236.13 7.95 164.3 3.35 159.95.7 154.48 0 147.91v-2.71c.49-6.26 2.79-11.53 6.9-15.8 7.36-7.66 19.57-9.83 28.93-4.54 2.43 1.37 5.02 3.36 7.77 5.97 70.6 67.01 141.33 134.03 212.18 201.07.14.13.36.13.5 0 68.67-65.07 138.5-131.25 209.49-198.54 5.38-5.1 9.26-8.16 11.65-9.18 16.38-7.01 33.18 3.62 34.58 21.14Z" />
          </svg>
        </div>
      </div>
  
      <div v-if="open"
        class="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-[#2b2b2b] ring-1 ring-black ring-opacity-5">
        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <a v-for="option in options" :key="option.value" href="#" @click.stop="selectOption(option)"
            class="px-4 py-2 text-sm text-white hover:bg-[#3f3f3f] flex justify-between" role="menuitem">
            <span>{{ option.name }}</span>
            <svg v-if="selectedOption.value === option.value" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" class="h-6 w-6 text-green-500">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, nextTick } from 'vue';
  
  export default {
    props: ['options', 'modelValue'],
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      const open = ref(false);
      const dropdown = ref(null);
      const selectedOption = ref(props.options.find(option => option.value === props.modelValue) || {});
  
      const selectOption = (option) => {
        emit('update:modelValue', option.value);
        selectedOption.value = option;
        open.value = false;
      };
  
      const closeDropdown = (event) => {
        if (!dropdown.value.contains(event.target)) {
          open.value = false;
        }
      };
  
      onMounted(() => {
        nextTick(() => {
          document.addEventListener('click', closeDropdown);
        });
      });
  
      return { open, selectOption, dropdown, selectedOption };
    },
  };
  </script>
  