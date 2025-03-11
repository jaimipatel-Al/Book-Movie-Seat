<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Movie } from '@/types/movie'
import MovieBox from '@/components/movie/MovieBox.vue'

const isGetting = ref(false)
const movies = ref<Movie[]>([])
const scrollComponent = ref()

const getMoviesList = async () => {
  isGetting.value = true

  await Axios.get(`${api.listMovie}?page=1&limit=8`)
    .then(({ data }) => {
      const res = data.data
      movies.value = res
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const handleScroll = () => {
  // const el = scrollComponent.value
  // if (!el) return
  // if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value) getMoviesList()
}

onMounted(() => {
  getMoviesList()
  scrollComponent.value?.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Movies</h2>
    </div>

    <p v-if="!isGetting && movies.length == 0" class="loading pa-10">
      <NoSymbolIcon class="r-w-8 mr-2" />No movie found ...
    </p>

    <div v-show="movies?.length" ref="scrollComponent" class="flex flex-wrap overflow-y-auto" style="height: 75vh">
      <MovieBox v-for="movie in movies" :key="movie._id" :movie="movie" />
    </div>
    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
  </div>
</template>
