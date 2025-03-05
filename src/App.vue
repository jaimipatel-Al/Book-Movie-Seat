<script setup lang="ts">
import HeaderComp from '@/components/layout/HeaderComp.vue'
import FooterComp from '@/components/layout/FooterComp.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const isActive = computed(() => authStore.userData?.isActive ?? true)
const isDefaultLayout = computed(() => route?.meta?.header ?? true)
</script>

<template>
  <main>
    <div v-if="!isActive" class="bg-red-700 p-1 text-center font-semibold text-white text-xs sm:text-sm">
      Your account is deactivated by system.
      <span class="text-gray-200 hover:underline cursor-pointer"> Active Now</span>
    </div>
    <HeaderComp v-if="isDefaultLayout" />
    <RouterView />
    <FooterComp v-if="isDefaultLayout" />
  </main>
</template>
