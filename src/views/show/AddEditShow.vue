<script setup lang="ts">
import { ArrowPathIcon, StarIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import type { Movie } from '@/types/movie'
import type { Theater } from '@/types/theater'
import type { Screen } from '@/types/screen'

const router = useRouter()
const route = useRoute()

const schema = yup.object({
  Theater: yup.string().required(),
  Screen: yup.string().required(),
  StartDate: yup.string().required('Start date is required'),
  EndDate: yup.string().required('End date is required'),
  Price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0)
    .max(10000),
})

const showId = ref('')
const isGetting = ref(false)
const isLoading = ref(false)
const movieId = ref('')
const movieDetail = ref<Movie>({})
const theater = ref('')
const screen = ref('')
const movieList = ref<Movie[]>([])
const totalMovies = ref(0)
const page = ref(0)
const theaterList = ref<Theater[]>([])
const screenList = ref<Screen[]>([])
const isGettingMovie = ref(false)
const isGettingTheater = ref(false)
const isGettingScreen = ref(false)
const startDate = ref('')
const endDate = ref('')
const price = ref('')
const scrollComponent = ref()

const getMoviesList = async () => {
  if (page.value !== 0 && movieList.value?.length == totalMovies.value) return

  isGettingMovie.value = true
  page.value++

  await Axios.get(`${api.listMovie}?page=${page.value}&limit=16`)
    .then(({ data }) => {
      const res = data.data
      const arr = res.movies
      movieList.value = [...movieList.value, ...arr]
      totalMovies.value = res.totalMovies
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!")
    })
    .finally(() => {
      isGettingMovie.value = false
    })
}

const getTheaterList = async () => {
  isGettingTheater.value = true

  await Axios.get(`${api.theaterList}?page=1&limit=100`)
    .then(({ data }) => {
      const res = data.data
      theaterList.value = res.theaters
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theaters Can't Load!")
    })
    .finally(() => {
      isGettingTheater.value = false
    })
}

const gerScreenList = async () => {
  screen.value = ''
  isGettingScreen.value = true

  await Axios.get(`${api.screenList}${theater.value}`)
    .then(({ data }) => {
      const res = data.data
      screenList.value = res.screens
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen details Can't Load!")
    })
    .finally(() => {
      isGettingScreen.value = false
    })
}

const addShow = async () => {
  if (!movieId.value) return toast.error('Please Select Movie First.')

  isLoading.value = true

  const payload = {
    ticketPrice: price.value,
    movieId: movieId.value,
    screenId: screen.value,
    theaterId: theater.value,
    startTime: new Date(startDate.value),
    endTime: new Date(endDate.value),
  }

  await Axios.post(api.addShow, payload)
    .then(({ data }) => {
      toast.success(data?.message ?? 'Show Added Successfully!')
      router.push('/show')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Add!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const updateShow = async () => {
  isLoading.value = true

  const payload = {
    ticketPrice: price.value,
    startTime: new Date(startDate.value),
    endTime: new Date(endDate.value),
  }

  await Axios.put(`${api.updateShow}${showId.value}`, payload)
    .then(({ data }) => {
      toast.success(data?.message ?? 'Show Added Successfully!')
      router.push('/show')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Add!")
    })
    .finally(() => {
      isLoading.value = false
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

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGettingMovie.value)
    getMoviesList()
}

const showDetails = async () => {
  isGetting.value = true

  await Axios.get(`${api.showDetails}${showId.value}`)
    .then(({ data }) => {
      const res = data.data
      theater.value = res.theaterId._id
      theaterList.value = [res.theaterId]

      screen.value = res.screenId._id
      screenList.value = [res.screenId]

      startDate.value = res.startTime?.split('T')[0]
      endDate.value = res.endTime?.split('T')[0]
      price.value = res.ticketPrice

      movieDetail.value = res.movieId
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Detail Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
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

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

onMounted(() => {
  scrollComponent.value?.addEventListener('scroll', handleScroll)
  if (route?.params?.id) {
    showId.value = Array.isArray(route.params.id) ? route.params.id[0] : String(route.params.id)
    showDetails()
  } else {
    getTheaterList()
    getMoviesList()
  }
})
</script>

<template>
  <div>
    <h2 class="r-text-3xl text-center pa-5">
      {{ showId ? 'Update' : 'Create' }} Show
      <span
        @click="router.push('/show')"
        class="text-normal font-normal hover:underline cursor-pointer"
      >
        Back To List
      </span>
    </h2>

    <p class="loading" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
    </p>
    <div v-else class="add-edit-form sm:flex flex-row-reverse justify-start">
      <div v-if="!showId" class="w-full sm:w-1/2 md:w-3/4">
        <p class="text-normal-base font-bold text-gray-900 cursor-pointer">Movie List</p>
        <p v-if="!isGettingMovie && movieList.length == 0" class="loading pa-10">
          <NoSymbolIcon class="r-w-8 mr-2" />No movie found ...
        </p>
        <div
          v-show="movieList?.length"
          ref="scrollComponent"
          class="flex flex-wrap overflow-y-auto"
          style="height: 70vh"
        >
          <div
            v-for="movie in movieList"
            :key="movie._id"
            class="p-0.5 sm:p-1.5 md:p-2 lg:p-3 mb-2 sm:mb-3 md:mb-4 lg:mb-5 w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 flex-none cursor-pointer"
            :class="[movie._id == movieId ? 'bg-black' : '']"
            @click="movieId = movie._id ?? ''"
          >
            <div class="relative">
              <img
                v-if="movie.posterUrl"
                :src="movie.posterUrl"
                :alt="movie.title"
                class="rounded-xl w-full h-36 sm:h-40 lg:h-48 object-cover border sm:border-2 border-gray-300"
              />
              <img
                v-else
                src="@/assets/img/film.png"
                :alt="movie.title"
                class="rounded-xl w-full h-36 sm:h-40 lg:h-48 object-cover border sm:border-2 border-gray-300"
              />
              <p
                class="text-xs sm:text-sm text-white bg-gray-900 opacity-80 rounded-b-xl w-full flex items-center p-0.5 sm:p-1 font-semibold absolute bottom-0"
              >
                <template v-if="movie.categories?.find((e) => e == 'Upcoming')">
                  <p class="px-1 sm:px-2">
                    Releasing on {{ formattedDate(movie.releaseDate || '') }}
                  </p>
                </template>
                <template v-else>
                  <StarIcon class="r-w-8 text-blue-700" />
                  <span class="px-1 sm:px-2">{{ movie.rating?.toFixed(2) }} / 10</span>
                </template>
              </p>
            </div>
            <p
              class="text-normal font-bold cursor-pointer hover:underline"
              :class="[movie._id == movieId ? ' text-white' : '']"
            >
              {{ movie.title }}
            </p>
          </div>
        </div>
        <p class="loading pa-10" v-if="isGettingMovie">
          <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
        </p>
      </div>
      <div v-else class="w-full sm:w-1/2 md:w-3/4 pa-5">
        <div class="w-full img-bg-height relative">
          <img
            v-if="movieDetail.backdropUrl"
            :src="movieDetail.backdropUrl"
            :alt="movieDetail.title"
            class="w-full h-full object-cover"
          />
          <div
            class="w-full h-full pa-10 flex flex-col md:flex-row items-center justify-center md:justify-start absolute top-0 bg-slate-700 bg-opacity-75 text-white"
          >
            <img
              v-if="movieDetail.posterUrl"
              :src="movieDetail.posterUrl"
              :alt="movieDetail.title"
              class="w-40 md:w-auto h-auto md:h-full rounded-xl object-cover"
            />
            <div class="pax-10">
              <h2 class="r-text-3xl">{{ movieDetail.title }}</h2>
              <p
                v-if="
                  movieDetail.categories?.find((e) => e == 'Upcoming') && movieDetail.releaseDate
                "
                class="text-normal px-2 md:px-3 py-1 md:py-2 my-1.5 md:my-3 bg-gray-900 bg-opacity-75 rounded-xl text-white"
              >
                Releasing on {{ formattedDate(movieDetail.releaseDate) }}
              </p>
              <div
                v-else
                class="flex items-center text-normal px-2 md:px-3 py-1 md:py-2 my-1.5 md:my-3 bg-gray-900 bg-opacity-75 rounded-xl text-white"
              >
                <StarIcon class="r-w-8 text-blue-700" />
                <span class="px-1 md:px-2">{{ movieDetail.rating?.toFixed(2) }} / 10</span>
              </div>
              <span
                v-if="movieDetail.languages?.length"
                class="text-normal px-2 md:px-3 py-1 md:py-1.5 bg-white bg-opacity-75 rounded-xl text-black font-semibold"
                >{{ addLanguage(movieDetail.languages) }}</span
              >
              <div class="flex flex-wrap items-center my-1.5 md:my-3 text-normal-base">
                <span v-if="movieDetail.duration">{{ formatMinutes(movieDetail.duration) }} </span>
                <p
                  v-if="movieDetail.duration"
                  class="bg-white w-2 h-2 rounded-full mx-1 md:mx-2"
                ></p>
                <span v-if="movieDetail.genres?.length">{{ movieDetail.genres.join(', ') }}</span>
                <p
                  v-if="movieDetail.genres?.length"
                  class="bg-white w-2 h-2 rounded-full mx-1 md:mx-2"
                ></p>
                <span
                  v-if="
                    !movieDetail.categories?.find((e) => e == 'Upcoming') && movieDetail.releaseDate
                  "
                >
                  {{ formattedDate(movieDetail.releaseDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Form
        class="w-full sm:w-1/2 md:w-1/4 flex-none"
        @submit="showId ? updateShow() : addShow()"
        :validation-schema="schema"
        v-slot="{ errors }"
      >
        <label for="theater">Theater</label>
        <Field v-model="theater" v-slot="{ field }" name="Theater">
          <select
            v-bind="field"
            id="theater"
            class="input"
            placeholder="Select Your Theater"
            :disabled="isGettingTheater || (showId ? true : false)"
            @change="gerScreenList()"
          >
            <option v-for="t in theaterList" :key="t._id" :value="t._id">
              {{ t.name }}
            </option>
          </select>
        </Field>
        <p class="error-message">{{ errors?.Theater }}</p>
        <label for="screen">Screen</label>
        <Field v-model="screen" v-slot="{ field }" name="Screen">
          <select
            v-bind="field"
            id="screen"
            class="input"
            placeholder="Select Your Screen"
            :disabled="isGettingTheater || isGettingScreen || !theater || (showId ? true : false)"
          >
            <option v-for="s in screenList" :key="s._id" :value="s._id">
              {{ s.name }}
            </option>
          </select>
        </Field>
        <p class="error-message">{{ errors?.Screen }}</p>
        <label for="startDate">Show Start Date {{ startDate }}</label>
        <Field
          v-model="startDate"
          type="date"
          name="StartDate"
          id="startDate"
          class="input"
          placeholder="Enter Your Show Start Date"
        />
        <p class="error-message">{{ errors?.StartDate }}</p>
        <label for="endDate">Show End Date</label>
        <Field
          v-model="endDate"
          type="date"
          name="EndDate"
          id="endDate"
          class="input"
          placeholder="Enter Your Show End Date"
        />
        <p class="error-message">{{ errors?.EndDate }}</p>
        <label for="price">Price</label>
        <Field
          v-model="price"
          type="number"
          name="Price"
          id="price"
          class="input"
          placeholder="Enter Price"
        />
        <p class="error-message">{{ errors?.Price }}</p>

        <button type="submit" :disabled="isLoading">
          <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2 animate-spin" />
          {{ showId ? 'Edit' : 'Add' }} Show
        </button>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.img-bg-height {
  height: 500px;
}

@media screen and (max-width: 768px) {
  .img-bg-height {
    height: 450px;
  }
}

@media screen and (max-width: 640px) {
  .img-bg-height {
    height: 400px;
  }
}
</style>
