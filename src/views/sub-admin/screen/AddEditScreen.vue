<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'

const router = useRouter()
const route = useRoute()

const schema = yup.object({
  Name: yup.string().required().max(50),
  Seat: yup
    .number()
    .required('No. of seat is required')
    .min(1, 'No. of seat must be greater than zero')
    .max(500, 'No. of seat must be less than or equal to 500')
    .typeError('No. of seat must be a valid number')
    .positive('No. of seat must be greater than zero'),
})

const theaterId = computed(() => route.query?.theaterId ?? '')

const screenId = ref('')
const isGetting = ref(false)
const isLoading = ref(false)
const name = ref('')
const seat = ref(0)

const addScreen = async () => {
  isLoading.value = true
  const payload = {
    name: name.value,
    totalSeats: seat.value,
    theaterId: theaterId.value,
  }

  await Axios.post(api.addScreen, payload)
    .then(({ data }) => {
      router.push(`/theater/view/${theaterId.value}`)
      toast.success(data?.message ?? 'Screen Created Successfully!')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Detail Can't Create!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const editScreen = async () => {
  isLoading.value = true
  const payload = {
    name: name.value,
    totalSeats: seat.value,
  }

  await Axios.put(`${api.editScreen}${screenId.value}`, payload)
    .then(({ data }) => {
      router.push(`/theater/view/${theaterId.value}`)
      toast.success(data?.message ?? 'Screen Updated Successfully!')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Detail Can't Update!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const getScreen = async () => {
  isGetting.value = true

  await Axios.get(`${api.getScreen}${route?.params?.id}`)
    .then(({ data }) => {
      const res = data.data
      name.value = res.name
      seat.value = res.totalSeats
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Screen Detail Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

onMounted(() => {
  if (route?.params?.id) {
    screenId.value = Array.isArray(route.params.id) ? route.params.id[0] : String(route.params.id)
    getScreen()
  }
})
</script>

<template>
  <div class="add-edit-form">
    <h2>
      {{ screenId ? 'Update' : 'Add' }} Screen
      <span @click="router.push(`/theater/view/${theaterId}`)"> Back To List </span>
    </h2>
    <p class="loading" v-if="isGetting"><ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...</p>
    <Form
      v-else
      class="add-theater-form"
      @submit="screenId ? editScreen() : addScreen()"
      :validation-schema="schema"
      v-slot="{ errors }"
    >
      <label for="name">Name</label>
      <Field
        v-model="name"
        type="text"
        name="Name"
        id="name"
        class="input"
        placeholder="Enter Your Name"
      />
      <p class="error-message">{{ errors?.Name }}</p>

      <label for="screen">No. Of Seat</label>
      <Field
        v-model="seat"
        type="number"
        name="Seat"
        id="screen"
        class="input"
        placeholder="Enter No. of Seat"
      />
      <p class="error-message">{{ errors?.Seat }}</p>

      <button type="submit" :disabled="isLoading">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" />
        {{ screenId ? 'Update' : 'Add' }} Theater
      </button>
    </Form>
  </div>
</template>
