<script setup lang="ts">
import { InformationCircleIcon } from "@heroicons/vue/24/solid";
</script>

<template>
  <div v-for="i in 5" :key="i" class="md:flex border-y-2 pa-5">
    <div class="md:w-1/3 lg:w-1/4">
      <p class="text-normal-base font-semibold">PVR: Arved Transcube, Ahmedabad</p>
      <p class="text-normal font-semibold">
        <span class="text-cyan-600 mr-4">M-Ticket</span
        ><span class="text-amber-600">Food and Beverage</span>
      </p>
    </div>
    <div>
      <div class="flex flex-wrap items-center">
        <div class="mx-2 flex items-center text-normal text-gray-800">
          <InformationCircleIcon class="r-w-8" /> INFO
        </div>
        <div
          v-for="j in 7"
          :key="j"
          class="t-nowrap text-normal text-green-600 pax-5 py-2 sm:py-3 m-0.5 sm:m-1 md:m-2 border shadow-md rounded-xl text-normal font-semibold"
        >
          <p>07:45 PM</p>
        </div>
      </div>
      <p class="text-xs sm:text-sm text-gray-600 my-2 sm:my-3">Cancellation available</p>
    </div>
  </div>
</template>
