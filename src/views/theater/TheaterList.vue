<script setup lang="ts">
  import { useRouter } from "vue-router";

  const router = useRouter();
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Theater</h2>
      <button class="blue-outline" @click="router.push('/theater/add-theater')">
        Add Theater
      </button>
    </div>
  </div>
</template>
