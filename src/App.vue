<script setup lang="ts">
import HeaderComp from "@/components/layout/HeaderComp.vue";
import FooterComp from "@/components/layout/FooterComp.vue";
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute();

const isDefaultLayout = computed(() => route?.meta?.header ?? true);
</script>

<template>
  <main>
    <HeaderComp v-if="isDefaultLayout" />
    <RouterView />
    <FooterComp v-if="isDefaultLayout" />
  </main>
</template>
