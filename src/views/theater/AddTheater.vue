<script setup lang="ts">
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'

const router = useRouter()
const route = useRoute()

const schema = yup.object({
  Name: yup.string().required().max(50),
  Location: yup.string().required().max(500),
  Screen: yup
    .number()
    .required('No. of screen is required')
    .min(1, 'No. of screen must be greater than zero')
    .max(10, 'No. of screen must be less than or equal to 10')
    .typeError('No. of screen must be a valid number')
    .positive('No. of screen must be greater than zero'),
  City: yup.string().required(),
})

const theaterId = ref('')
const isGetting = ref(false)
const isGettingCity = ref(false)
const isLoading = ref(false)
const name = ref('')
const location = ref('')
const city = ref('')
const screen = ref(0)
const image = ref()
const imageUrl = ref()
const file = ref()
const cities = ref([])

const handleFileUpload = (event: Event) => {
  const file = event.target?.files?.[0] ?? ''
  if (file) {
    image.value = file
    imageUrl.value = URL.createObjectURL(file)
  }
}
const removeImage = () => {
  imageUrl.value = null
  image.value = null
  file.value.value = null
}

const addTheater = async () => {
  isLoading.value = true

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('location', location.value)
  formData.append('city', city.value)
  formData.append('no_of_screens', screen.value)
  if (image.value) formData.append('image', image.value ? image.value : '')

  await Axios.post(api.addTheater, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(({ data }) => {
      toast.success(data?.message ?? 'Theater Added Successfully!')
      router.push('/theater')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Add!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const updateTheater = async () => {
  isLoading.value = true

  const formData = new FormData()
  formData.append('name', name.value)
  formData.append('location', location.value)
  formData.append('city', city.value)
  formData.append('no_of_screens', screen.value)
  if (image.value || (!imageUrl.value && !image.value))
    formData.append('image', image.value ? image.value : '')

  await Axios.patch(`${api.updateTheater}${theaterId.value}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
    .then(({ data }) => {
      toast.success(data?.message ?? 'Theater Updated Successfully!')
      router.push('/theater')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Update!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

const getCityList = async () => {
  isGettingCity.value = true

  await Axios.get(api.cityList)
    .then(({ data }) => {
      const res = data.data
      cities.value = res
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "User Can't Load!")
    })
    .finally(() => {
      isGettingCity.value = false
    })
}

const getTheaterData = async () => {
  isGetting.value = true

  await Axios.get(`${api.getTheaterDetails}${route.params.id}`)
    .then(({ data }) => {
      const res = data.data
      name.value = res.name
      location.value = res.location
      screen.value = res.no_of_screens
      city.value = res.city._id
      imageUrl.value = res.image
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

onMounted(() => {
  getCityList()
  if (route?.params?.id) {
    theaterId.value = route?.params?.id ?? ''
    getTheaterData()
  }
})
</script>

<template>
  <div class="add-edit-form">
    <h2>{{ theaterId ? 'Update' : 'Add' }} Theater</h2>
    <p class="loading" v-if="isGetting"><ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...</p>
    <Form
      v-else
      class="add-theater-form"
      @submit="theaterId ? updateTheater() : addTheater()"
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

      <label for="location">Location</label>
      <Field
        v-model="location"
        type="text"
        name="Location"
        id="location"
        class="input"
        placeholder="Enter Your Location"
      />
      <p class="error-message">{{ errors?.Location }}</p>

      <label for="city">City</label>
      <Field v-model="city" v-slot="{ field }" name="City">
        <select
          v-bind="field"
          id="city"
          class="input"
          placeholder="Enter Your City"
          :disabled="isGettingCity"
        >
          <option v-for="c in cities" :key="c._id" :value="c._id">
            {{ c.name }}, {{ c.state }}
          </option>
        </select>
      </Field>
      <p class="error-message">{{ errors?.City }}</p>

      <label for="screen">No. Of Screen</label>
      <Field
        v-model="screen"
        type="number"
        name="Screen"
        id="screen"
        class="input"
        placeholder="Enter Your Screen"
      />
      <p class="error-message">{{ errors?.Screen }}</p>

      <div class="block w-full">
        <label for="image" style="display: flex" class="items-center">
          Upload Image
          <ArrowUpTrayIcon
            class="r-w-10 p-1 sm:p-2 cursor-pointer border border-gray-400 hover:bg-slate-200 mx-2 rounded-full"
            v-if="!imageUrl"
            @click="file.click()"
          />
          <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
        </label>
        <div v-if="imageUrl" class="relative mat-5 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24">
          <XMarkIcon
            class="absolute w-6 sm:w-8 p-1 bg-red-500 hover:bg-red-600 cursor-pointer rounded-full -top-2 -right-2 text-white"
            @click="removeImage()"
          />
          <img :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover border" />
        </div>
      </div>

      <button type="submit" :disabled="isLoading">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" />
        {{ theaterId ? 'Update' : 'Add' }} Theater
      </button>
    </Form>
  </div>
</template>
