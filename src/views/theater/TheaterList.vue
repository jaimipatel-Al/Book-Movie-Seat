<script setup lang="ts">
import {
  ArrowPathIcon,
  NoSymbolIcon,
  FilmIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Theater } from '@/types/theater'

const router = useRouter()

const isGetting = ref(false)
const page = ref(0)
const theaters = ref<Theater[]>([])
const totalTheaters = ref(0)
const scrollComponent = ref()

const getTheaterList = async () => {
  if (page.value !== 0 && theaters.value?.length == totalTheaters.value) return

  page.value++
  isGetting.value = true

  await Axios.get(`${api.theaterList}?page=${page.value}&limit=8`)
    .then(({ data }) => {
      const res = data.data
      theaters.value =
        res.theaters?.map((e: Theater) => {
          return { ...e, isDeleting: false }
        }) ?? []
      totalTheaters.value = res.total
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theaters Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const deleteTheater = async (val: Theater) => {
  val.isDeleting = true

  await Axios.delete(`${api.deleteTheater}${val._id}`)
    .then(({ data }) => {
      toast.success(data.message ?? 'Theater deleted successfully.')
      page.value = 0
      theaters.value = []
      getTheaterList()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Deleted!")
    })
    .finally(() => {
      val.isDeleting = false
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value) getTheaterList()
}

const toggleTheaterStatus = async (id?: string) => {
  await Axios.patch(`${api.toggleTheaterStatus}${id}`)
    .then(({ data }) => {
      toast.success(data.message)
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Status Can't Change!")
    })
}

onMounted(() => {
  getTheaterList()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Theater</h2>
      <button class="blue-outline" @click="router.push('/theater/add')">Add Theater</button>
    </div>

    <div ref="scrollComponent" class="h-5/6 overflow-y-auto px-5 md:px-0">
      <div class="w-full md:w-11/12 md:mx-auto sm:flex flex-wrap justify-between items-center">
        <div v-for="t in theaters" :key="t._id" class="w-full md:w-1/2 pa-5">
          <div class="pa-5 border rounded-xl shadow-md flex flex-col sm:flex-row sm:space-x-4">
            <img
              v-if="t.image"
              :src="t.image"
              :alt="t.name"
              class="w-full sm:w-1/3 h-full sm:h-32 object-cover"
            />
            <FilmIcon v-else class="w-1/3 pax-10 hidden sm:block" />
            <div class="w-full sm:w-2/3">
              <h2 class="flex justify-between w-full">
                <span
                  class="r-text-2xl text-gray-700 cursor-pointer hover:underline"
                  @click="router.push(`/theater/view/${t._id}`)"
                  >{{ t.name }}</span
                >
                <div class="flex">
                  <ArrowPathIcon
                    v-if="t.isDeleting"
                    class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-red-600"
                  />
                  <TrashIcon
                    v-else
                    class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-red-600"
                    @click="deleteTheater(t)"
                  />
                  <PencilIcon
                    class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-green-600"
                    @click="router.push(`/theater/edit/${t._id}`)"
                  />
                </div>
              </h2>
              <p class="font-semibold text-normal text-gray-500">
                {{ t.location }}
                <span class="px-3 md:px-5">{{ `${t.city?.name}, ${t.city?.state}` }}</span>
              </p>
              <label for="remember" class="text-normal">
                <input
                  v-model="t.isActive"
                  type="checkbox"
                  id="remember"
                  class="w-4 h-4 cursor-pointer"
                  @change="toggleTheaterStatus(t._id)"
                />
                Is Active Owner
              </label>
            </div>
          </div>
        </div>
      </div>

      <p class="loading pa-10" v-if="isGetting">
        <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="theaters.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No theaters found ...
      </p>
    </div>
  </div>
</template>
