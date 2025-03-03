<script setup lang="ts">
  import Carousel from "primevue/carousel";

  const imageSource1 = new URL("@/assets/img/movie-poster/movie1.jpg", import.meta.url).href;
  const imageSource2 = new URL("@/assets/img/movie-poster/movie2.jpg", import.meta.url).href;
  const imageSource3 = new URL("@/assets/img/movie-poster/movie3.jpg", import.meta.url).href;

  interface Video {
    id: number;
  }

  const videos: Video[] = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];
</script>

<template>
  <div>
    <Carousel :value="videos" :numVisible="1" :numScroll="1" :autoplayInterval="3000" circular>
      <template #item="{ data }">
        <div class="cursor-pointer text-center">
          <img v-if="data.id == 1" :src="imageSource1" alt="Thumbnail" class="img-thumbnail" />
          <img v-if="data.id == 2" :src="imageSource2" alt="Thumbnail" class="img-thumbnail" />
          <img v-if="data.id == 3" :src="imageSource3" alt="Thumbnail" class="img-thumbnail" />
        </div>
      </template>
    </Carousel>
  </div>
</template>
