<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowPathIcon, NoSymbolIcon, TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted } from 'vue'
import type { Show } from '@/types/show'

const router = useRouter()

const isLoading = ref(false)
const shows = ref<Show[]>([])
const selectedDate = ref('')

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

const getShowList = async () => {
  isLoading.value = true

  await Axios.get(`${api.showList}?startDate=${selectedDate.value}`)
    .then(async ({ data }) => {
      const res = data.data
      shows.value = res
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Load!")
    })
    .finally(() => {
      isLoading.value = false
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
    const movie = {
      id: e.movieId._id,
      title: e.movieId.title,
      duration: e.movieId.duration,
      rating: e.movieId.rating,
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

    if (!arr?.length || index == -1) arr.push({ ...theater, movies: [{ ...movie, show: [show] }] })
    else {
      const movieIndex = arr[index].movies.findIndex((el) => el.id == e.movieId._id)
      if (movieIndex == -1) arr[index].movies.push({ ...movie, show: [show] })
      else arr[index].movies[movieIndex].show.push(show)
    }
  })

  return arr
})

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

onMounted(() => {
  selectedDate.value = nextFiveDays.value[0].date
  getShowList()
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Show</h2>
      <button class="blue-outline" @click="router.push('/show/add')">Add New Show</button>
    </div>

    <div class="flex space-x-1 sm:space-x-2 justify-center">
      <div
        v-for="(day, index) in nextFiveDays"
        :key="index"
        class="cursor-pointer px-1 sm:px-2 md:px-3 py-1 sm:py-2 md:py-3 w-12 sm:w-16 md:w-20 rounded-xl border-2 border-gray-200 text-center hover:shadow-lg date-item"
        :class="{ active: selectedDate === day.date }"
        @click="
          selectedDate = day.date;
          getShowList()
        "
      >
        <div class="text-normal font-bold">{{ day.day }}</div>
        <div class="text-normal-base">{{ day.dateNum }}</div>
        <div class="text-normal">{{ day.month }}</div>
      </div>
    </div>

    <p class="loading pa-10" v-if="isLoading">
      <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
    </p>

    <p class="loading pa-10" v-else-if="showList.length == 0">
      <NoSymbolIcon class="r-w-8 mr-2" />No Show found ...
    </p>

    <div v-else v-for="s in showList" :key="s.id" class="m-10">
      <div class="text-center pt-8 pb-3">
        <p class="text-yellow-800 font-bold text-2xl">
          <span class="cursor-pointer" @click="router.push(`/theater/view/${s.id}`)">{{
            s.name
          }}</span>
          <span class="text-normal text-red-700">{{
            !s.isActive ? '(Currently Not Active)' : ''
          }}</span>
        </p>
        <p class="text-normal text-gray-700 font-semibold">{{ s.location }}</p>
      </div>
      <div v-for="m in s.movies" :key="m.id" class="md:flex pa-5 border-y-2">
        <div class="md:w-1/5 lg:w-1/6">
          <p
            class="text-normal-base font-semibold cursor-pointer"
            @click="router.push(`/movie/${m.id}`)"
          >
            {{ m.title }}
          </p>
          <div class="text-normal font-semibold">
            <p class="text-cyan-600 mr-4">{{ formatMinutes(m.duration) }}</p>
            <p class="text-amber-600">{{ m.rating?.toFixed(2) }} / 10</p>
          </div>
        </div>
        <div>
          <div class="flex flex-wrap items-center">
            <div
              v-for="sh in m.show"
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
                <div class="flex">
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

              <div class="pt-2 sm:pt-4">
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
