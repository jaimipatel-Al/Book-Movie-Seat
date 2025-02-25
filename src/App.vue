<script setup lang="ts">
import HeaderComp from '@/components/layout/HeaderComp.vue'
import FooterComp from '@/components/layout/FooterComp.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <HeaderComp />
  <main>
    <RouterView />
  </main>
  <FooterComp />
</template>
