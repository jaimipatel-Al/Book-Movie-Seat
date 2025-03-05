<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon, FilmIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Theater } from '@/types/theater'
import type { Owner } from '@/types/owner'

const router = useRouter()
const route = useRoute()

const isGetting = ref(false)
const page = ref(0)
const theaters = ref<Theater[]>([])
const owner = ref<Owner>({})
const totalTheaters = ref(0)
const scrollComponent = ref()

const ownerTheater = async () => {
  if (page.value !== 0 && theaters.value?.length == totalTheaters.value) return

  page.value++
  isGetting.value = true

  await Axios.get(`${api.ownerTheater}?page=${page.value}&limit=8&ownerId=${route.params.id}`)
    .then(({ data }) => {
      const res = data.data
      owner.value = res.owner
      theaters.value = res.theaters
      totalTheaters.value = res.total
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theaters Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

const handleScroll = () => {
  const el = scrollComponent.value
  if (!el) return
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value) ownerTheater()
}

onMounted(() => {
  ownerTheater()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pa-10 flex items-center"
      @click="router.push('/owner')"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back To List
    </p>
    <div v-if="owner._id" class="owner-detail">
      <img v-if="owner.image" :src="owner.image" :alt="owner.name" />
      <table>
        <tr>
          <td colspan="2">
            <h2 class="r-text-3xl">{{ owner.name }}</h2>
          </td>
        </tr>
        <tr>
          <td class="font-semibold">Email</td>
          <td>{{ owner.email }}</td>
        </tr>
        <tr>
          <td class="font-semibold">Mobile</td>
          <td>{{ owner.mobile }}</td>
        </tr>
        <tr>
          <td colspan="2" v-if="!owner.isActive" class="error-message">Not Active yet !!</td>
        </tr>
      </table>
    </div>

    <!-- theaters -->
    <h2 v-if="owner._id" class="r-text-2xl text-center underline text-gray-800 mat-5">Theater</h2>
    <div ref="scrollComponent" class="h-4/6 overflow-y-auto">
      <div class="w-full md:mx-auto flex flex-wrap justify-between items-center">
        <div v-for="t in theaters" :key="t._id" class="w-1/2 md:w-1/3 pa-5">
          <div class="pa-5 border rounded-xl shadow-md flex flex-col sm:flex-row sm:space-x-4">
            <img
              v-if="t.image"
              :src="t.image"
              :alt="t.name"
              class="w-full sm:w-1/3 h-full sm:h-24 object-cover"
            />
            <FilmIcon v-else class="w-32 sm:w-1/3 pax-5" />
            <div class="w-2/3">
              <h2
                class="text-normal-base font-semibold text-gray-700 cursor-pointer hover:underline"
              >
                {{ t.name }}
              </h2>
              <p class="font-semibold text-normal text-gray-500">{{ t.location }}</p>
              <p class="font-semibold text-normal text-gray-500">
                {{ `${t.city?.name}, ${t.city?.state}` }}
              </p>
              <p v-if="!t.isActive" class="error-message">Not Active yet !!</p>
            </div>
          </div>
        </div>
      </div>

      <p class="loading pa-10" v-if="isGetting">
        <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="theaters.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No theaters added ...
      </p>
    </div>
  </div>
</template>
