<script setup lang="ts">
  import { ArrowPathIcon, NoSymbolIcon } from "@heroicons/vue/24/solid";
  import { useRouter } from "vue-router";
  import Axios from "@/plugin/axios";
  import api from "@/plugin/apis";
  import toast from "@/plugin/toast";
  import { onMounted, ref } from "vue";

  const router = useRouter();

  const isGetting = ref(false);
  const page = ref(0);
  const theaters = ref([]);
  const totalTheaters = ref(0);
  const scrollComponent = ref();

  const getTheaterList = async () => {
    if (page.value !== 0 && theaters.value?.length == totalTheaters.value) return;

    page.value++;
    isGetting.value = true;

    await Axios.get(`${api.theaterList}?page=${page.value}&limit=8`)
      .then(({ data }) => {
        const res = data.data;
        theaters.value = res.theaters;
        totalTheaters.value = res.total;
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "Theaters Can't Load!");
      })
      .finally(() => {
        isGetting.value = false;
      });
  };

  const handleScroll = () => {
    const el = scrollComponent.value;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 50 && !isGetting.value)
      getTheaterList();
  };

  onMounted(() => {
    getTheaterList();
    scrollComponent.value.addEventListener("scroll", handleScroll);
  });
</script>

<template>
  <div>
    <div class="main-header">
      <h2>Theater</h2>
      <button class="blue-outline" @click="router.push('/theater/add-theater')">
        Add Theater
      </button>
    </div>

    <div ref="scrollComponent" class="h-5/6 overflow-y-auto">
      <div v-for="t in theaters" :key="t._id">
        {{ t.name }}
      </div>

      <p class="loading pa-10" v-if="isGetting">
        <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="theaters.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No theaters found ...
      </p>
    </div>
  </div>
</template>
