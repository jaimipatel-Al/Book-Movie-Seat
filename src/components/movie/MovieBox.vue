<script setup lang="ts">
import { useRouter } from 'vue-router'
import { StarIcon, CameraIcon } from '@heroicons/vue/24/solid'
import { ref, type PropType } from 'vue'
import type { Movie } from '@/types/movie'
import { useAuthStore } from '@/stores/auth'
import toast from '@/plugin/toast'
import api from '@/plugin/apis'
import Axios from '@/plugin/axios'

const authStore = useAuthStore()

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    default: () => {},
  },
})

const image = ref()
const imageUrl = ref()
const file = ref()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  if (file) {
    image.value = file
    imageUrl.value = URL.createObjectURL(file)
    uploadPoster()
  }
}

const uploadPoster = async () => {
  const formData = new FormData()
  if (image.value || (!imageUrl.value && !image.value))
    formData.append('image', image.value ? image.value : '')

  await Axios.put(`${api.addPoster}${props.movie._id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(() => {
      toast.success('Poster updated successfully!')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Poster Can't Added!")
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

const router = useRouter()
</script>

<template>
  <div
    class="p-0.5 sm:p-1.5 md:p-3 lg:p-4 xl:p-5 mab-10 w-1/3 sm:w-1/4 md:w-1/5 xl:w-1/6 flex-none cursor-pointer"
  >
    <div class="relative">
      <img
        v-if="props.movie.posterUrl"
        :src="props.movie.posterUrl"
        :alt="props.movie.title"
        class="rounded-xl w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover border sm:border-2 border-gray-300"
        @click="router.push(`/movie/${props.movie._id}`)"
      />
      <div
        v-else-if="authStore?.userData?.role == 'super_admin' && !imageUrl"
        class="rounded-xl w-full h-48 sm:h-64 md:h-72 lg:h-96 p-5 sm:p-10 flex justify-center items-center text-gray-500 border sm:border-2 border-gray-300"
        @click="file.click()"
      >
        <CameraIcon />
        <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
      </div>
      <div v-else-if="authStore?.userData?.role == 'super_admin' && imageUrl">
        <img
          :src="imageUrl"
          :alt="props.movie.title"
          class="rounded-xl w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover border sm:border-2 border-gray-300"
        />
      </div>
      <img
        v-else
        src="@/assets/img/film.png"
        :alt="props.movie.title"
        class="rounded-xl w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover border sm:border-2 border-gray-300"
      />
      <p
        class="text-white bg-gray-900 opacity-80 rounded-b-xl w-full flex items-center p-0.5 sm:p-1 font-semibold absolute bottom-0"
      >
        <template v-if="props.movie.categories?.find((e) => e == 'Upcoming')">
          <p class="px-1 sm:px-2">
            Releasing on {{ formattedDate(props.movie.releaseDate || '') }}
          </p>
        </template>
        <template v-else>
          <StarIcon class="r-w-8 text-blue-700" />
          <span class="px-1 sm:px-2">{{ props.movie.rating?.toFixed(2) }} / 10</span>
        </template>
      </p>
    </div>
    <div @click="router.push(`/movie/${props.movie._id}`)">
      <h2
        class="text-sm sm:text-base md:text-xl xl:text-2xl font-bold text-gray-700 cursor-pointer hover:underline"
      >
        {{ props.movie.title }}
      </h2>
      <p v-if="props.movie.genres" class="text-normal text-gray-500">
        {{ props.movie.genres.join(' / ') }}
      </p>
    </div>
  </div>
</template>
