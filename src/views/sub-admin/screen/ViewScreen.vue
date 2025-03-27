<script setup lang="ts">
import {
  ArrowPathIcon,
  ArrowLeftIcon,
  NoSymbolIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import { computed, onMounted, ref } from 'vue'
import toast from '@/plugin/toast'
import type { Show } from '@/types/show'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const router = useRouter()
const route = useRoute()

const id = computed(() => route.params?.id ?? '')

const isGetting = ref(false)
const isLoading = ref(false)
const name = ref('')
const seat = ref(0)
const shows = ref<Show[]>([])
const selectedDate = ref('')

const getScreen = async () => {
  isGetting.value = true

  await Axios.get(`${api.getScreen}${id.value}`)
    .then(({ data }) => {
      const res = data.data
      name.value = res.name
      seat.value = res.totalSeats
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Detail Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const showList = async () => {
  isLoading.value = true

  await Axios.get(`${api.showList}?startDate=${selectedDate.value}&screenId=${id.value}`)
    .then(({ data }) => {
      const res = data.data
      shows.value =
        res?.map((e: Show) => {
          return { ...e, isDeleting: false }
        }) ?? []
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Load!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const toggleShowStatus = async (id?: string) => {
  await Axios.put(`${api.toggleShowStatus}${id}`)
    .then(({ data }) => {
      toast.success(data.message)
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Status Can't Change!")
    })
}

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

const deleteShow = async (val: Show) => {
  await Axios.delete(`${api.deleteShow}${val._id}`)
    .then(({ data }) => {
      toast.success(data.message ?? 'Show deleted successfully.')
      showList()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Deleted!")
    })
}

onMounted(() => {
  selectedDate.value = nextFiveDays.value[0].date
  getScreen()
  showList()
})
</script>

<template>
  <div>
    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pt-4 sm:pt-6 md:pt-8 lg:pt-10 pax-10 flex items-center"
      @click="router.go(-1)"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back To List
    </p>

    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
    </p>
    <div v-else>
      <div class="main-header">
        <h2 class="text-center">{{ name }}</h2>
        <p>Seat : {{ seat }}</p>
      </div>
      <!-- seatLayoutId -->
      <!-- <button class="blue-outline" @click="router.push('/owner/add')">Add Owner</button> -->
      <button></button>
      <div class="flex justify-between pa-10">
        <h3 class="font-bold text-normal-base">Show</h3>
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
          @click="((selectedDate = day.date), showList())"
        >
          <div class="text-normal font-bold">{{ day.day }}</div>
          <div class="text-normal-base">{{ day.dateNum }}</div>
          <div class="text-normal">{{ day.month }}</div>
        </div>
      </div>
      <p class="loading pa-10" v-if="isLoading">
        <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="shows.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No Show found ...
      </p>
      <div v-else class="sm:flex space-5 flex-wrap">
        <div
          v-for="sh in shows"
          :key="sh._id"
          class="t-nowrap pax-5 py-2 sm:py-3 m-0.5 sm:m-1 md:m-2 border shadow-md rounded-xl font-semibold flex space-x-5 m -2 sm:m-0"
        >
          <img :src="sh.movieId.posterUrl" :alt="sh.movieId.title" class="w-28 sm:w-36" />
          <div>
            <div class="flex space-x-5">
              <p
                class="text-blue-700 text-normal cursor-pointer"
                @click="router.push(`/movie/${sh.movieId._id}`)"
              >
                {{ sh.movieId.title }}
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
            <p class="text-cyan-600 text-normal font-semibold mr-4">
              {{ formatMinutes(sh.movieId.duration) }}
            </p>
            <p class="text-amber-600 text-normal font-semibold">
              {{ sh.movieId.rating?.toFixed(2) }} / 10
            </p>
            <p class="text-gray-900 text-normal font-semibold">₹ {{ sh.ticketPrice }}/-</p>
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
              <label :for="`${sh._id}-ACTIVE`" class="text-xs sm:text-sm">Active Show</label><br />
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
</template>

<style scoped>
.date-item {
  background: white;
  transition: 0.3s;
}

.date-item.active {
  background: rgb(50, 50, 250);
  color: white;
}
</style>
