<script setup lang="ts">
  import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
  import { ref } from 'vue';

  const searchMovie = ref('')

  const searchingMovie = () => { }
</script>

<template>
  <header class="pay-5 pax-10 flex justify-between">
    <div class="flex r-space-x-3">
      <img src="@/assets/img/icon.svg" alt="Logo" class="w-12" />
      <div class="flex r-space-x-3 border border-gray-400 rounded-xl w-96">
        <MagnifyingGlassIcon class="w-6 text-gray-500 mx-2" />
        <input v-model="searchMovie" type="search"
          class="w-full text-lg px-3 py-2 rounded-xl placeholder:text-gray-400 outline-none text-gray-600"
          placeholder="Search Your Movie" @input="searchingMovie()" />
      </div>
    </div>
  </header>
</template>
