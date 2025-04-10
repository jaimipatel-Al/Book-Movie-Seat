<script setup lang="ts">
import {
  ArrowPathIcon,
  NoSymbolIcon,
  StarIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref, computed } from 'vue'
import type { Movie } from '@/types/movie'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { Show } from '@/types/show'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isGetting = ref(false)
const id = computed(() => route.params?.id ?? '')
const movie = ref<Movie>({})
const shows = ref<Show[]>([])
const selectedDate = ref('')
const isGettingShow = ref(false)

const getMoviesList = async () => {
  isGetting.value = true

  await Axios.get(`${api.getMovie}${id.value}`)
    .then(({ data }) => {
      const res = data.data
      movie.value = res
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

const getShowList = async () => {
  isGettingShow.value = true

  await Axios.get(`${api.showList}?startDate=${selectedDate.value}&movieId=${id.value}`)
    .then(async ({ data }) => {
      const res = data.data
      shows.value = res
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Load!")
    })
    .finally(() => {
      isGettingShow.value = false
    })
}

const showList = computed(() => {
  let arr: any[] = []

  shows.value.forEach((e) => {
    const index = arr.findIndex((el) => el.id == e.theaterId._id)
    const theater = {
      id: e.theaterId._id,
      name: e.theaterId.name,
      location: e.theaterId.location,
      isActive: e.theaterId.isActive,
    }
    const show = {
      _id: e._id,
      isActive: e.screenId.isActive,
      screenId: e.screenId._id,
      screenName: e.screenId.name,
      ticketPrice: e.ticketPrice,
      startTime: e.startTime,
      status: e.status,
    }

    if (!arr?.length || index == -1) arr.push({ ...theater, show: [show] })
    else arr[index].show.push(show)
  })

  return arr
})

const nextFiveDays = computed(() => {
  const days = []
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(today.getDate() + i)

    days.push({
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      dateNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    })
  }

  return days
})

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const formattedTime = (val: string) => {
  const date = new Date(val)
  const minutes = date.getUTCMinutes()
  let hours = date.getUTCHours()

  const zone = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  const formattedMinutes = minutes.toString().padStart(2, '0')

  return `${hours}:${formattedMinutes} ${zone}`
}

const deleteShow = async (val: Show) => {
  await Axios.delete(`${api.deleteShow}${val._id}`)
    .then(({ data }) => {
      toast.success(data.message ?? 'Show deleted successfully.')
      getShowList()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Deleted!")
    })
}

const toggleShowStatus = async (id?: string, val?: string) => {
  await Axios.put(`${api.toggleShowStatus}${id}`, {
    status: val,
  })
    .then(({ data }) => {
      toast.success(data.message)
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Status Can't Change!")
    })
}

onMounted(() => {
  selectedDate.value = nextFiveDays.value[0].date
  getMoviesList()
  getShowList()
})
</script>

<template>
  <div>
    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pa-10 flex items-center"
      @click="router.go(-1)"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back to movie list
    </p>
    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
    </p>
    <p class="loading pa-10" v-else-if="!movie?._id">
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
          class="w-full h-full pa-10 flex flex-col sm:flex-row items-center justify-center sm:justify-start absolute top-0 bg-slate-700 bg-opacity-75 text-white"
        >
          <img
            v-if="movie.posterUrl"
            :src="movie.posterUrl"
            :alt="movie.title"
            class="w-40 sm:w-auto h-auto sm:h-full rounded-xl object-cover"
          />
          <div class="pax-10">
            <h2 class="r-text-3xl">{{ movie.title }}</h2>

            <p
              v-if="movie.categories?.find((e) => e == 'Upcoming') && movie.releaseDate"
              class="text-normal px-2 sm:px-3 py-1 sm:py-2 my-1.5 sm:my-3 bg-gray-900 bg-opacity-75 rounded-xl text-white"
            >
              Releasing on {{ formattedDate(movie.releaseDate) }}
            </p>
            <div
              v-else
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
            <div class="flex flex-wrap items-center my-1.5 sm:my-3 text-normal-base">
              <span v-if="movie.duration">{{ formatMinutes(movie.duration) }} </span>
              <p v-if="movie.duration" class="bg-white w-2 h-2 rounded-full mx-1 sm:mx-2"></p>
              <span v-if="movie.genres?.length">{{ movie.genres.join(', ') }}</span>
              <p v-if="movie.genres?.length" class="bg-white w-2 h-2 rounded-full mx-1 sm:mx-2"></p>
              <span v-if="!movie.categories?.find((e) => e == 'Upcoming') && movie.releaseDate">
                {{ formattedDate(movie.releaseDate) }}
              </span>
            </div>
            <button
              class="blue-btn px-5 sm:px-10 py-2 sm:py-3 text-base sm:text-xl"
              v-if="authStore?.userData?.role == 'customer'"
            >
              Book Now
            </button>
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
      <div class="flex justify-between items-end pa-10">
        <h2 class="r-text-2xl">Shows</h2>
        <button
          v-if="authStore?.userData?.role == 'sub_admin'"
          class="blue-outline"
          @click="router.push('/show/add')"
        >
          Add New Show
        </button>
      </div>
      <div class="flex space-x-1 sm:space-x-2 justify-center mb-5">
        <div
          v-for="(day, index) in nextFiveDays"
          :key="index"
          class="cursor-pointer px-1 sm:px-2 md:px-3 py-1 sm:py-2 md:py-3 w-12 sm:w-16 md:w-20 rounded-xl border-2 border-gray-200 text-center hover:shadow-lg date-item"
          :class="{ active: selectedDate === day.date }"
          @click="((selectedDate = day.date), getShowList())"
        >
          <div class="text-normal font-bold">{{ day.day }}</div>
          <div class="text-normal-base">{{ day.dateNum }}</div>
          <div class="text-normal">{{ day.month }}</div>
        </div>
      </div>
      <p class="loading pa-10" v-if="isGettingShow">
        <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="showList.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No Show found ...
      </p>
      <div v-else v-for="s in showList" :key="s.id" class="md:flex pa-5 border-y-2">
        <div class="md:w-1/5 lg:w-1/6">
          <p
            class="text-normal-base font-semibold cursor-pointer"
            @click="router.push(`/theater/view/${s.id}`)"
          >
            <span class="cursor-pointer" @click="router.push(`/theater/view/${s.id}`)">{{
              s.name
            }}</span
            ><span class="text-normal text-red-700">{{
              !s.isActive ? '(Currently Not Active)' : ''
            }}</span>
          </p>
          <div class="text-normal font-semibold">
            <p class="text-amber-600">{{ s.location }}</p>
          </div>
        </div>
        <div>
          <div class="flex flex-wrap items-center">
            <div
              v-for="sh in s.show"
              :key="sh._id"
              :class="{ 'bg-slate-200': !sh.isActive }"
              class="t-nowrap pax-5 py-2 sm:py-3 m-0.5 sm:m-1 md:m-2 border shadow-md rounded-xl font-semibold"
            >
              <div class="flex justify-between">
                <p
                  class="text-blue-700 text-normal cursor-pointer"
                  @click="router.push(`/screen/view/${sh.screenId}?theaterId=${s.id}`)"
                >
                  {{ sh.screenName }}
                </p>
                <div v-if="authStore?.userData?.role == 'sub_admin'" class="flex">
                  <PencilIcon
                    class="p-1 text-green-700 r-w-8 hover:bg-slate-200 cursor-pointer rounded-full"
                    @click="router.push(`/show/edit/${sh._id}`)"
                  />
                  <TrashIcon
                    class="p-1 text-red-700 r-w-8 hover:bg-slate-200 cursor-pointer rounded-full"
                    @click="deleteShow(sh)"
                  />
                </div>
              </div>
              <p class="text-gray-900 text-normal">₹ {{ sh.ticketPrice }}/-</p>
              <p class="text-gray-700 text-xs sm:text-sm">
                {{ formattedTime(sh.startTime) }}
              </p>

              <div v-if="authStore?.userData?.role == 'sub_admin'" class="pt-2 sm:pt-4">
                <input
                  type="radio"
                  :id="`${sh._id}-ACTIVE`"
                  :name="`${sh._id}-status`"
                  value="ACTIVE"
                  v-model="sh.status"
                  @change="toggleShowStatus(sh._id, sh.status)"
                />
                <label :for="`${sh._id}-ACTIVE`" class="text-xs sm:text-sm">Active Show</label
                ><br />
                <input
                  type="radio"
                  :id="`${sh._id}-CANCELLED`"
                  :name="`${sh._id}-status`"
                  value="CANCELLED"
                  v-model="sh.status"
                  @change="toggleShowStatus(sh._id, sh.status)"
                />
                <label :for="`${sh._id}-CANCELLED`" class="text-xs sm:text-sm">Cancelled Show</label
                ><br />
              </div>
              <div v-else class="pt-2 sm:pt-4">
                <label v-if="sh.status == 'ACTIVE'" class="text-normal text-green-700"
                  >Active Show</label
                >
                <label v-else class="text-normal text-red-700">Cancelled Show</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.img-bg-height {
  height: 500px;
}

@media screen and (max-width: 768px) {
  .img-bg-height {
    height: 350px;
  }
}

@media screen and (max-width: 640px) {
  .img-bg-height {
    height: 500px;
  }
}

.date-item {
  background: white;
  transition: 0.3s;
}

.date-item.active {
  background: rgb(50, 50, 250);
  color: white;
}
</style>
