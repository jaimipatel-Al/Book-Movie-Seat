<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon, StarIcon } from '@heroicons/vue/24/solid'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Movie } from '@/types/movie'

const isGetting = ref(false)
const movie = ref<Movie>({})

const getMoviesList = async () => {
  isGetting.value = true

  await Axios.get(`${api.listMovie}?page=1&limit=8`)
    .then(({ data }) => {
      const res = data.data
      movie.value = res[1]
      console.log(movie.value)
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const formattedDate = (val: string) => {
  const date = new Date(val)
  return date
    .toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    .replace(/(\d+) (\w+) (\d+)/, '$1 $2, $3')
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const addLanguage = (lan: string[]) => {
  let languages = ''

  lan.forEach((el) => {
    switch (el) {
      case 'hi':
        languages = ' Hindi '
        break
      case 'en':
        languages = ' English '
        break
      case 'gu':
        languages = 'Gujarati'
    }
  })

  return languages
}

onMounted(() => {
  getMoviesList()
})
</script>

<template>
  <div>
    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
    <p class="loading pa-10" v-else-if="!movie._id">
      <NoSymbolIcon class="r-w-8 mr-2" />Can't found movie details ...
    </p>

    <div v-else>
      <div class="w-full img-bg-height relative">
        <img
          v-if="movie.backdropUrl"
          :src="movie.backdropUrl"
          :alt="movie.title"
          class="w-full h-full object-cover"
        />
        <div
          class="w-full h-full pa-10 flex items-center absolute top-0 bg-slate-700 bg-opacity-75 text-white"
        >
          <img
            v-if="movie.posterUrl"
            :src="movie.posterUrl"
            :alt="movie.title"
            class="w-auto h-full rounded-xl object-cover"
          />
          <div class="pax-10">
            <h2 class="r-text-3xl">{{ movie.title }}</h2>

            <p
              v-if="movie.isUpcoming && movie.releaseDate"
              class="text-normal px-2 sm:px-3 py-1 sm:py-2 my-1.5 sm:my-3 bg-gray-900 bg-opacity-75 rounded-xl text-white"
            >
              Releasing on {{ formattedDate(movie.releaseDate) }}
            </p>
            <div
              class="flex items-center text-normal px-2 sm:px-3 py-1 sm:py-2 my-1.5 sm:my-3 bg-gray-900 bg-opacity-75 rounded-xl text-white"
            >
              <StarIcon class="r-w-8 text-blue-700" />
              <span class="px-1 sm:px-2">{{ movie.rating?.toFixed(2) }} / 10</span>
            </div>
            <span
              v-if="movie.languages?.length"
              class="text-normal px-2 sm:px-3 py-1 sm:py-1.5 bg-white bg-opacity-75 rounded-xl text-black font-semibold"
              >{{ addLanguage(movie.languages) }}</span
            >
            <div class="flex items-center my-1.5 sm:my-3 text-normal-base">
              <span v-if="movie.duration">{{ formatMinutes(movie.duration) }} </span>
              <p v-if="movie.duration" class="bg-white w-2 h-2 rounded-full mx-1 sm:mx-2"></p>
              <span v-if="movie.genres?.length">{{ movie.genres.join(', ') }}</span>
              <p v-if="movie.genres?.length" class="bg-white w-2 h-2 rounded-full mx-1 sm:mx-2"></p>
              <span v-if="!movie.isUpcoming && movie.releaseDate">
                {{ formattedDate(movie.releaseDate) }}
              </span>
            </div>
            <button class="blue-btn px-10 py-3 text-xl">Book Now</button>
          </div>
        </div>
      </div>
      <template v-if="movie.overview">
        <h2 class="r-text-2xl pa-10">About the movie</h2>
        <p class="text-normal pax-10">{{ movie.overview }}</p>
      </template>
      <div v-if="movie.cast?.length">
        <h2 class="r-text-2xl pa-10">Cast</h2>
        <div class="flex flex-wrap">
          <template v-for="c in movie.cast" :key="c.name">
            <div v-if="c.profilePath" class="w-24 sm:w-36 md:w-48 ma-5 text-center">
              <img
                :src="`https://image.tmdb.org/t/p/w780${c.profilePath}`"
                :alt="c.name"
                class="w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 object-cover rounded-full m-auto border"
              />
              <p class="font-semibold text-normal">{{ c.name }}</p>
              <p class="text-normal text-gray-700">{{ c.character }}</p>
            </div>
          </template>
        </div>
      </div>
      <div v-if="movie.crew?.length">
        <h2 class="r-text-2xl pa-10">Crew</h2>
        <div class="flex flex-wrap">
          <template v-for="c in movie.crew" :key="c.name">
            <div v-if="c.profilePath" class="w-24 sm:w-36 md:w-48 ma-5 text-center">
              <img
                :src="`https://image.tmdb.org/t/p/w780${c.profilePath}`"
                :alt="c.name"
                class="w-20 sm:w-32 md:w-40 h-20 sm:h-32 md:h-40 object-cover rounded-full m-auto border"
              />
              <p class="font-semibold text-normal">{{ c.name }}</p>
              <p class="text-normal text-gray-700">{{ c.job }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-bg-height {
  height: 500px;
}
</style>
