<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted, ref } from 'vue'
import type { Owner } from '@/types/owner'

const router = useRouter()

const isGetting = ref(false)
const page = ref(0)
const owners = ref<Owner[]>([])
const totalOwner = ref(0)
const scrollComponent = ref()

const getOwnerList = async () => {
  if (page.value !== 0 && owners.value?.length == totalOwner.value) return

  page.value++
  isGetting.value = true

  await Axios.get(`${api.ownerList}?page=${page.value}&limit=8`)
    .then(({ data }) => {
      const res = data.data
      owners.value = res.subAdmins
      totalOwner.value = res.total
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
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value) getOwnerList()
}

const toggleOwnerStatus = async (id: string) => {
  await Axios.patch(`${api.toggleOwnerStatus}${id}`)
    .then(({ data }) => {
      toast.success(data.message)
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Owner Status Can't Change!")
    })
}

onMounted(() => {
  getOwnerList()
  scrollComponent.value.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Owners</h2>
      <button class="blue-outline" @click="router.push('/owner/add')">Add Owner</button>
    </div>

    <div ref="scrollComponent" class="h-5/6 overflow-y-auto px-5 md:px-0">
      <div
        v-for="o in owners"
        :key="o._id"
        class="pa-5 border rounded-xl shadow-md w-full md:w-2/3 my-5 md:mx-auto"
      >
        <h2
          class="r-text-2xl text-gray-700 cursor-pointer hover:underline"
          @click="router.push(`/owner/view/${o._id}`)"
        >
          {{ o.name }}
        </h2>
        <p
          class="flex sm:items-center space-y-1 sm:space-y-0 space-x-0 sm:space-x-5 md:space-x-10 font-semibold text-normal text-gray-500 flex-wrap flex-col sm:flex-row"
        >
          <span class="t-nowrap">{{ o.email }}</span>
          <span class="t-nowrap">{{ o.mobile }}</span>
          <label for="remember">
            <input
              v-model="o.isActive"
              type="checkbox"
              id="remember"
              class="w-4 h-4 cursor-pointer"
              @change="toggleOwnerStatus(o._id)"
            />
            Is Active Owner
          </label>
        </p>
      </div>

      <p class="loading pa-10" v-if="isGetting">
        <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="owners.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No owners found ...
      </p>
    </div>
  </div>
</template>
