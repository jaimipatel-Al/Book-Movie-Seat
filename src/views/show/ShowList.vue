<script setup lang="ts">
import { ref } from 'vue'
import { TrashIcon, PencilIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { onMounted } from 'vue'
import type { Show } from '@/types/show'

const router = useRouter()

const isLoading = ref(false)
const shows = ref<Show[]>([])

const showList = async () => {
  isLoading.value = true

  await Axios.get(`${api.showList}67c84c17e5914853b4fe3dea`)
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

const deleteShow = async (val: Show) => {
  val.isDeleting = true

  await Axios.delete(`${api.deleteShow}${val._id}`)
    .then(({ data }) => {
      toast.success(data.message ?? 'Show deleted successfully.')
      showList()
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Show Can't Deleted!")
    })
    .finally(() => {
      val.isDeleting = false
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

onMounted(() => {
  showList()
})
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Show</h2>
      <button class="blue-outline" @click="router.push('/show/add')">Add New Show</button>
    </div>

    <div v-for="s in shows" :key="s._id">
      {{ s._id }}
      <PencilIcon
        class="p-1 text-green-700 r-w-10 hover:bg-slate-200 cursor-pointer rounded-full"
        @click="router.push(`/show/edit/${s._id}`)"
      />
      <TrashIcon
        class="p-1 text-red-700 r-w-10 hover:bg-slate-200 cursor-pointer rounded-full"
        @click="deleteShow(s)"
      />
      <label for="remember">
        {{ s.status }}
        <input
          v-model="s.status"
          type="checkbox"
          class="w-4 h-4 cursor-pointer"
          :id="s._id"
          @change="toggleShowStatus(s._id)"
        />
        Is Active Show
      </label>
    </div>
  </div>
</template>
