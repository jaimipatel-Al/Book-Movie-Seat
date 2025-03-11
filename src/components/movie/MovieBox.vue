<script setup lang="ts">
import { useRouter } from 'vue-router'
import { StarIcon } from '@heroicons/vue/24/solid'
import { type PropType } from 'vue'
import type { Movie } from '@/types/movie'

const props = defineProps({
  movie: {
    type: Object as PropType<Movie>,
    default: () => {},
  },
})

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
    v-if="props.movie.posterUrl"
    class="p-0.5 sm:p-1.5 md:p-3 lg:p-4 xl:p-5 mab-10 w-1/3 sm:w-1/4 md:w-1/5 xl:w-1/6 flex-none cursor-pointer"
    @click="router.push(`/movie/${props.movie._id}`)"
  >
    <div class="relative">
      <img
        :src="props.movie.posterUrl"
        :alt="props.movie.title"
        class="rounded-xl w-full h-48 sm:h-64 md:h-72 lg:h-96 object-cover border sm:border-2 border-gray-300"
      />
      <p
        class="text-white bg-gray-900 opacity-80 rounded-b-xl w-full flex items-center p-0.5 sm:p-1 font-semibold absolute bottom-0"
      >
        <template v-if="props.movie.isUpcoming">
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
    <h2
      class="text-sm sm:text-base md:text-xl xl:text-2xl font-bold text-gray-700 cursor-pointer hover:underline"
    >
      {{ props.movie.title }}
    </h2>
    <p v-if="props.movie.genres" class="text-normal text-gray-500">
      {{ props.movie.genres.join(' / ') }}
    </p>
  </div>
</template>
