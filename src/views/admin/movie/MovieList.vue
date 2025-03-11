<script setup lang="ts">
import { ArrowPathIcon, NoSymbolIcon } from "@heroicons/vue/24/solid";
import Axios from "@/plugin/axios";
import api from "@/plugin/apis";
import toast from "@/plugin/toast";
import { onMounted, ref } from "vue";
import type { Movie } from "@/types/movie";
import MovieList from "@/components/movie/MovieList.vue";

const isGetting = ref(false);
const movies = ref<Movie[]>([]);

const movieSync = async () => {
  await Axios.post(api.movieSync)
    .then(({ data }) => {
      toast.success(data.message ?? "Movies synced successfully!");
      getMoviesList();
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't sync!");
    });
};

const getMoviesList = async () => {
  isGetting.value = true;

  await Axios.get(`${api.listMovie}?page=1&limit=8`)
    .then(({ data }) => {
      const res = data.data;
      movies.value = res;
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Movie Can't Load!");
    })
    .finally(() => {
      isGetting.value = false;
    });
};

onMounted(() => {
  getMoviesList();
});
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Movies</h2>
      <button class="blue-outline" @click="movieSync()">Sync New Movies</button>
    </div>

    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
    <p class="loading pa-10" v-else-if="movies.length == 0">
      <NoSymbolIcon class="r-w-8 mr-2" />No movie found ...
    </p>

    <div v-else>
      <MovieList :movies="movies" title="Recommended Movies" />
    </div>
  </div>
</template>
