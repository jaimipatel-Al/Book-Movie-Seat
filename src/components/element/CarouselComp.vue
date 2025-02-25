<template>
  <Carousel :value="videos" :numVisible="2" :numScroll="1">
    <template #item="{ data }">
      <div class="video-item" @click="redirectToYoutube(data.url)">
        <img :src="data.thumbnail" alt="Thumbnail" class="video-thumbnail" />
        <h4>{{ data.title }}</h4>
      </div>
    </template>
  </Carousel>
</template>

<script setup lang="ts">
import Carousel from "primevue/carousel";

interface Video {
  title: string;
  url: string;
  thumbnail: string;
}


const videos: Video[] = [
  {
    title: "Vue 3 Tutorial",
    url: "https://www.youtube.com/watch?v=qZXt1Aom3Cs",
    thumbnail: "https://img.youtube.com/vi/qZXt1Aom3Cs/0.jpg",
  },
  {
    title: "Vue Router Guide",
    url: "https://www.youtube.com/watch?v=FXpIoQ_rT_c",
    thumbnail: "https://img.youtube.com/vi/FXpIoQ_rT_c/0.jpg",
  },
  {
    title: "Composition API",
    url: "https://www.youtube.com/watch?v=hCHLx-jIaLs",
    thumbnail: "https://img.youtube.com/vi/hCHLx-jIaLs/0.jpg",
  },
];

const redirectToYoutube = (url: string): void => {
  window.open(url, "_blank");
};
</script>

<style scoped>
.video-item {
  text-align: center;
  cursor: pointer;
}

.video-thumbnail {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;
}

.video-thumbnail:hover {
  transform: scale(1.05);
}
</style>
