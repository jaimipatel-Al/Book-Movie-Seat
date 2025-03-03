<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const openLink = (link: string) => {
  window.open(link, "_blank");
};
</script>

<template>
  <footer class="bg-gray-800 text-center mt-2 md:mt-3">
    <div class="flex items-center r-space-x-3 pay-10">
      <div class="flex-line"></div>
      <div
        class="flex items-center r-text-3xl cursor-pointer text-gray-100"
        @click="router.push('/')"
      >
        <img src="@/assets/img/icon.svg" alt="Logo" class="w-8 sm:w-10 md:w-12" />
        <h1 class="mx-1">Book<span class="italic text-blue-700">Movie</span>Seat</h1>
      </div>
      <div class="flex-line"></div>
    </div>

    <h2 class="text-sm md:text-lg text-white pay-5">
      <span class="font-bold">Got a Movie to Showcase?</span> Partner with OokMovieSeat
      and get listed to reach a wider audience!
    </h2>

    <div class="flex items-center justify-center pa-10">
      <img
        src="@/assets/img/icon/facebook.svg"
        alt="facebook"
        class="social-icon"
        @click="openLink('https://www.facebook.com/')"
      />
      <img
        src="@/assets/img/icon/instagram.svg"
        alt="instagram"
        class="social-icon"
        @click="openLink('https://www.instagram.com/')"
      />
      <img
        src="@/assets/img/icon/twitter.svg"
        alt="twitter"
        class="social-icon"
        @click="openLink('https://x.com/')"
      />
      <img
        src="@/assets/img/icon/linkedin.svg"
        alt="linkedin"
        class="social-icon"
        @click="openLink('https://www.linkedin.com/')"
      />
      <img
        src="@/assets/img/icon/youtube.svg"
        alt="youtube"
        class="social-icon"
        @click="openLink('https://www.youtube.com/')"
      />
    </div>

    <p class="text-gray-300 text-normal pay-5">
      Copyright 2025 © Book Movie Seat - Jaimi Patel
    </p>
  </footer>
</template>

<style scoped>
.flex-line {
  flex: 1 1 0%;
  height: 1px;
  background: #ccc;
}
</style>
