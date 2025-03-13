<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Movie } from '@/types/movie'
import MovieList from '@/components/movie/MovieList.vue'

const isGetting = ref(false)
const movies = ref<Movie[]>([])
const newMovies = ref<Movie[]>([])
const upcomingMovies = ref<Movie[]>([])
const gujaratiMovies = ref<Movie[]>([])
const hindiMovies = ref<Movie[]>([])
const englishMovies = ref<Movie[]>([])

const movieSync = async () => {
  await Axios.post(api.movieSync)
    .then(({ data }) => {
      toast.success(data.message ?? 'Movies synced successfully!')
      getMoviesList()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't sync!")
    })
}

const getMoviesList = async () => {
  isGetting.value = true

  await Axios.get(`${api.listMovie}?page=1&limit=8`)
    .then(({ data }) => {
      const res = data.data
      movies.value = res.movies
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const getMoviesListByShow = () => {
  getMoviesByShow('Now Showing')
  getMoviesByShow('Upcoming')
}

const getMoviesByShow = async (type: string) => {
  isGetting.value = true

  await Axios.get(`${api.listMovie}?page=1&limit=8&category=${type}`)
    .then(({ data }) => {
      const res = data.data
      if (type == 'Now Showing') newMovies.value = res.movies
      else if (type == 'Upcoming') upcomingMovies.value = res.movies
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const getMoviesListByLan = () => {
  getMoviesByLang('en')
  getMoviesByLang('hi')
  getMoviesByLang('gu')
}

const getMoviesByLang = async (type: string) => {
  isGetting.value = true

  await Axios.get(`${api.listMovie}?page=1&limit=8&language=${type}`)
    .then(({ data }) => {
      const res = data.data
      if (type == 'en') englishMovies.value = res.movies
      else if (type == 'hi') hindiMovies.value = res.movies
      else if (type == 'gu') gujaratiMovies.value = res.movies
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

onMounted(() => {
  getMoviesList()
  getMoviesListByShow()
  getMoviesListByLan()
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Movies</h2>
      <button class="blue-outline" @click="movieSync()">Sync New Movies</button>
    </div>

    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
    <p class="loading pa-10" v-else-if="movies.length == 0">
      <NoSymbolIcon class="r-w-8 mr-2" />No movie found ...
    </p>

    <div v-else>
      <MovieList :movies="movies" seeAll="all-movies" title="Recommended Movies" />
      <MovieList :movies="newMovies" seeAll="new-movies" title="Now Showing" />
      <MovieList :movies="upcomingMovies" seeAll="upcoming-movies" title="Upcoming Movies" />
      <MovieList :movies="hindiMovies" seeAll="hindi-movies" title="Hindi Movies" />
      <MovieList :movies="englishMovies" seeAll="english-movies" title="English Movies" />
      <MovieList :movies="gujaratiMovies" seeAll="gujarati-movies" title="Gujarati Movies" />
    </div>
  </div>
</template>
