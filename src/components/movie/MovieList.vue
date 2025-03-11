<script setup lang="ts">
import { type PropType } from 'vue'
import type { Movie } from '@/types/movie'
import MovieBox from '@/components/movie/MovieBox.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  movies: {
    type: Array as PropType<Movie[]>,
    default: () => [],
  },
  title: {
    type: String,
  },
})

const router =useRouter()
</script>

<template>
  <div>
    <div class="flex justify-between pax-10">
      <h3 class="text-normal-base font-bold text-gray-700">{{ title }}</h3>
      <span class="text-blue-800 underline cursor-pointer hover:text-blue-600" @click="router.push(`/movie-list/m`)">See All</span>
    </div>
    <div class="flex overflow-x-hidden">
      <MovieBox v-for="movie in props.movies" :key="movie._id" :movie="movie" />
    </div>
  </div>
</template>
