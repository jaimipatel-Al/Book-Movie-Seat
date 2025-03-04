<script setup lang="ts">
import {
  ArrowPathIcon,
  NoSymbolIcon,
  FilmIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/vue/24/solid";
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
      <button class="blue-outline" @click="router.push('/theater/add')">
        Add Theater
      </button>
    </div>

    <div ref="scrollComponent" class="h-5/6 overflow-y-auto px-5 md:px-0">
      <div
        class="w-full md:w-11/12 md:mx-auto sm:flex flex-wrap justify-between items-center"
      >
        <div v-for="o in theaters" :key="o._id" class="w-full md:w-1/2 pa-5">
          <div
            class="pa-5 border rounded-xl shadow-md flex flex-col sm:flex-row sm:space-x-4"
          >
            <img
              v-if="o.image"
              :src="o.image"
              :alt="o.name"
              class="w-full sm:w-1/3 h-full sm:h-32 object-cover"
            />
            <FilmIcon v-else class="w-1/3 pax-10 hidden sm:block" />
            <div class="w-2/3">
              <h2
                class="flex justify-between w-full"
              >
                <span class="r-text-2xl text-gray-700 cursor-pointer hover:underline " @click="router.push(`/owner/view/${o._id}`)">{{ o.name }}</span>
                <div class="flex">
                  <TrashIcon class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-1 text-red-600" />
                  <PencilIcon class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-1 text-green-600"
                  @click="router.push(`/theater/edit/${o._id}`)" />
                </div>
              </h2>
              <p class="font-semibold text-normal text-gray-500">
                {{ o.location }}
                <span class="px-3 md:px-5">{{ `${o.city?.name}, ${o.city?.state}` }}</span>
              </p>
              <label for="remember">
                <input
                  v-model="o.isActive"
                  type="checkbox"
                  id="remember"
                  class="w-4 h-4 cursor-pointer"
                />
                Is Active Owner
              </label>
            </div>
          </div>
        </div>
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
