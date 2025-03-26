<script setup lang="ts">
import {
  ArrowPathIcon,
  NoSymbolIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
} from "@heroicons/vue/24/solid";
import { useRoute, useRouter } from "vue-router";
import Axios from "@/plugin/axios";
import api from "@/plugin/apis";
import toast from "@/plugin/toast";
import { computed, onMounted, ref } from "vue";
import type { Screen } from "@/types/screen";
import type { Theater } from "@/types/theater";

const router = useRouter();
const route = useRoute();

const id = computed(() => route.params?.id ?? "");

const isGetting = ref(false);
const screens = ref<Screen[]>([]);
const theater = ref<Theater>({});

const deleteScreen = async (val: Screen) => {
  val.isDeleting = true;

  await Axios.delete(`${api.deleteScreen}${val._id}`)
    .then(({ data }) => {
      screenList();
      toast.success(data.message ?? "Screen deleted successfully.");
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Can't Deleted!");
    })
    .finally(() => {
      val.isDeleting = false;
    });
};

const toggleScreenStatus = async (id?: string) => {
  await Axios.patch(`${api.toggleScreenStatus}${id}`)
    .then(({ data }) => {
      toast.success(data.message);
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Status Can't Change!");
    });
};

const screenList = async () => {
  isGetting.value = true;

  await Axios.get(`${api.screenList}${id.value}`)
    .then(({ data }) => {
      const res = data.data;
      screens.value =
        res.screens?.map((e: Screen) => {
          return { ...e, isDeleting: false };
        }) ?? [];
      theater.value = res?.theaterData ?? {};
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen details Can't Load!");
    })
    .finally(() => {
      isGetting.value = false;
    });
};

onMounted(() => {
  screenList();
});
</script>

<template>
  <div>
    <p
      class="text-normal text-blue-600 hover:underline cursor-pointer pa-10 flex items-center"
      @click="router.go(-1)"
    >
      <ArrowLeftIcon class="r-w-8 cursor-pointer px-1" />Back To List
    </p>

    <div v-if="theater._id" class="theater-detail">
      <img v-if="theater.image" :src="theater.image" :alt="theater.name" />
      <table>
        <tr>
          <td colspan="2">
            <h2 class="r-text-3xl">{{ theater.name }}</h2>
          </td>
        </tr>
        <tr>
          <td class="font-semibold">Location</td>
          <td>
            {{ `${theater.location} - ${theater.city?.name}, ${theater.city?.state}` }}
          </td>
        </tr>
        <tr>
          <td class="font-semibold">No. Of Screen</td>
          <td>{{ theater.no_of_screens }}</td>
        </tr>
        <tr>
          <td colspan="2" v-if="!theater.isActive" class="error-message">
            Not Active yet !!
          </td>
        </tr>
      </table>
    </div>

    <p class="loading pa-10" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2 animate-spin" />Getting Data ...
    </p>
    <div v-else>
      <div class="main-header">
        <h2>Screens</h2>
        <button class="blue-outline" @click="router.push(`/screen/add?theaterId=${id}`)">
          Add Screens
        </button>
      </div>
      <p class="loading pa-10" v-if="screens.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No Screen found ...
      </p>
      <div v-else class="flex flex-wrap sm:pax-10">
        <div v-for="s in screens" :key="s._id" class="pa-5 w-1/2 sm:w-2/6 lg:w-1/4">
          <div class="border shadow-sm rounded-lg pa-5">
            <h2 class="flex justify-between w-full">
              <span
                class="text-normal-base text-gray-700 cursor-pointer hover:underline"
                @click="router.push(`/screen/view/${s._id}`)"
                >{{ s.name }}</span
              >
              <div class="flex">
                <ArrowPathIcon
                  v-if="s.isDeleting"
                  class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-red-600 animate-spin"
                />
                <TrashIcon
                  v-else
                  class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-red-600"
                  @click="deleteScreen(s)"
                />
                <PencilIcon
                  class="r-w-8 cursor-pointer hover:bg-slate-200 rounded-full p-0.5 sm:p-1 text-green-600"
                  @click="router.push(`/screen/edit/${s._id}?theaterId=${id}`)"
                />
              </div>
            </h2>
            <label for="remember" class="text-normal">
              <input
                v-model="s.isActive"
                type="checkbox"
                id="remember"
                class="w-4 h-4 cursor-pointer"
                @change="toggleScreenStatus(s._id)"
              />
              Is Active Owner
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
