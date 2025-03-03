<script setup lang="ts">
  import Carousel from "primevue/carousel";
  import { ref } from "vue";

  const imageSource1 = new URL("@/assets/img/movie-poster/movie3.jpg", import.meta.url)
    .href;
  const imageSource2 = new URL("@/assets/img/movie-poster/movie2.jpg", import.meta.url)
    .href;

  interface Video {
    id: number;
  }

  const videos: Video[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ];

  const responsiveOptions = ref([
    { breakpoint: "1280px", numVisible: 5, numScroll: 2 },
    { breakpoint: "1024px", numVisible: 4, numScroll: 2 },
    { breakpoint: "768px", numVisible: 4, numScroll: 1 },
    { breakpoint: "640px", numVisible: 3, numScroll: 1 },
  ]);
</script>

<template>
  <div >
    <Carousel :value="videos" :numVisible="5" :numScroll="2" :autoplayInterval="10000" circular
      :responsiveOptions="responsiveOptions">
      <template #item="{ data }">
        <div class="cursor-pointer text-center w-11/12 m-auto">
          <img v-if="
            data.id == 1 || data.id == 3 || data.id == 5 || data.id == 7 || data.id == 9
          " :src="imageSource1" alt="Thumbnail" class="sub-img-thumbnail" />
          <img v-if="
            data.id == 2 ||
            data.id == 4 ||
            data.id == 6 ||
            data.id == 8 ||
            data.id == 10
          " :src="imageSource2" alt="Thumbnail" class="sub-img-thumbnail" />
        </div>
      </template>
    </Carousel>
  </div>
</template>
