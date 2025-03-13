<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import MovieBox from '@/components/movie/MovieBox.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const filter = computed(() => route.params?.filter ?? '')

const isGetting = ref(false)
const movies = ref<Movie[]>([])
const scrollComponent = ref()
const page = ref(0)
const totalMovies = ref(0)

const getMoviesList = async () => {
  if (page.value !== 0 && movies.value?.length == totalMovies.value) return

  isGetting.value = true
  page.value++

  const params =
    filter.value == 'new-movies'
      ? 'category=Now Showing'
      : filter.value == 'upcoming-movies'
      ? 'category=Upcoming'
      : filter.value == 'hindi-movies'
      ? 'language=hi'
      : filter.value == 'english-movies'
      ? 'language=en'
      : filter.value == 'gujarati-movies'
      ? 'language=gu'
      : ''

  await Axios.get(`${api.listMovie}?page=${page.value}&limit=20&${params}`)
    .then(({ data }) => {
      const res = data.data
      const arr = res.movies
      movies.value = [...movies.value, ...arr]
      totalMovies.value = res.totalMovies
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value) getMoviesList()
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

    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pa-10 flex items-center"
      @click="router.push('/movie')"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back to movie list
    </p>

    <p v-if="!isGetting && movies.length == 0" class="loading pa-10">
      <NoSymbolIcon class="r-w-8 mr-2" />No movie found ...
    </p>

    <div
      v-show="movies?.length"
      ref="scrollComponent"
      class="flex flex-wrap overflow-y-auto"
      style="height: 75vh"
    >
      <MovieBox v-for="movie in movies" :key="movie._id" :movie="movie" />
    </div>
    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
  </div>
</template>
