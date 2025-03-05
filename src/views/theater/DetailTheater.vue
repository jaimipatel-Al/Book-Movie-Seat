<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { computed, onMounted, ref } from 'vue'
import type { Screen } from '@/types/screen'
import type { Theater } from '@/types/theater'

const router = useRouter()
const route = useRoute()

const id = computed(() => route.params?.id ?? '')

const isGetting = ref(false)
const screens = ref<Screen[]>([])
const theater = ref<Theater>({})

const screenList = async () => {
  isGetting.value = true

  await Axios.get(`${api.screenList}${id.value}`)
    .then(({ data }) => {
      const res = data.data
      screens.value =
        res.screens?.map((e: Screen) => {
          return { ...e, isDeleting: false }
        }) ?? []
      theater.value = res?.theaterData ?? {}
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen details Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

onMounted(() => {
  screenList()
})
</script>

<template>
  <div>
    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pa-10 flex items-center"
      @click="router.push('/theater')"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back To List
    </p>

    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>

    <div v-else class="theater-detail px-1 sm:px-2">
      <img v-if="theater.image" :src="theater.image" :alt="theater.name" />
      <div>
        <h2 class="r-text-3xl">
          {{ theater.name }}
          <span class="font-normal text-normal">
            {{ `${theater.location} - ${theater.city?.name}, ${theater.city?.state}` }}
          </span>
        </h2>
        <p v-if="!theater.isActive" class="error-message">Not Active yet !!</p>
        <div>
          <h2 class="py-y sm:py-2 underline text-normal-base font-bold text-center text-gray-700">
            Screens ({{ theater.no_of_screens }})
          </h2>
          <p class="loading pa-10" v-if="screens.length == 0">
            <NoSymbolIcon class="r-w-8 mr-2" />No Screen found ...
          </p>
          <div v-else class="flex flex-wrap">
            <div v-for="s in screens" :key="s._id" class="p-1 sm:p-2 w-1/2 sm:w-40 md:w-52">
              <div class="border shadow-sm rounded-lg px-3 py-2 sm:py-3">
                <h2
                  class="flex justify-between w-full text-normal text-gray-800 font-semibold cursor-pointer hover:underline"
                >
                  {{ s.name }}
                </h2>
                <p class="text-xs sm:text-sm text-gray-700">No. Of Seat : {{ s.totalSeats }}</p>
                <p colspan="2" v-if="!s.isActive" class="error-message">Not Active yet !!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
