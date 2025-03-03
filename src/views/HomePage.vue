<script setup lang="ts">
import MainSuggestion from "@/components/element/MainSuggestion.vue";
import SubSuggestion from "@/components/element/SubSuggestion.vue";
</script>

<template>
  <div>
    <MainSuggestion />
    <div class="md:w-11/12 m-auto">
      <h2 class="ma-5">Recommended Movies</h2>
      <SubSuggestion />
    </div>
  </div>
</template>
