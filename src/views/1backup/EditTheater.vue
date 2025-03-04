<script setup lang="ts">
  import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/vue/24/solid'
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import Axios from "@/plugin/axios";
  import api from "@/plugin/apis";
  import toast from "@/plugin/toast";

  const router = useRouter();
  const route=useRoute();

  const schema = yup.object({
    Name: yup.string().required().max(50),
    Email: yup.string().required().email(),
    Mobile: yup
      .number()
      .typeError("Mobile number must be a number")
      .required("Mobile number is required")
      .test(
        "len",
        "Mobile number must be exactly 10 digits",
        (val) => val?.toString().length === 10
      ),
    Location: yup.string().required().max(500),
    Screen: yup.number().required('No. of screen is required').min(1, 'No. of screen must be greater than zero')
      .max(10, 'No. of screen must be less than or equal to 10').typeError('No. of screen must be a valid number').positive('No. of screen must be greater than zero'),
    City: yup.string().required(),
  });

  const isGetting = ref(false);
  const isLoading = ref(false);
  const name = ref("");
  const email = ref("");
  const mobile = ref("");
  const location = ref("");
  const city = ref("");
  const screen = ref(0)
  const image = ref()
  const imageUrl = ref()
  const file = ref()

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

  const editTheater = async () => {
    isLoading.value = true;

    const user = {
      name: name.value,
      email: email.value,
      mobile: mobile.value,
    };

    await Axios.post(api.editTheater, user)
      .then(({ data }) => {
        toast.success(data?.message ?? "Theater Updated Successfully!");
        router.push("/theater");
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "Theater Can't Update!");
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const getTheaterDetails = async () => {
    isGetting.value = true;

    await Axios.get(`${api.getTheaterDetails}${route.params.id}`)
      .then(({ data }) => {
        const res = data.data;

        email.value = res.email;
        name.value = res.name;
        mobile.value = res.mobile;
        imageUrl.value = res.image;
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "Theater Can't Load!");
      })
      .finally(() => {
        isGetting.value = false;
      });
  };

  onMounted(() => {
    getTheaterDetails();
  });
</script>

<template>
  <div class="add-edit-form">
    <h2>Update Theater Details</h2>

    <p class="loading" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
    <Form v-else class="edit-theater-form" @submit="editTheater" :validation-schema="schema" v-slot="{ errors }">

      <div class="form-flex-div">
        <label for="name">Name</label>
        <Field v-model="name" type="text" name="Name" id="name" class="input" placeholder="Enter Your Name" />
        <p class="error-message">{{ errors?.Name }}</p>
      </div>

      <div class="form-flex-div">
        <label for="email">Email Address</label>
        <Field v-model="email" type="email" name="Email" id="email" class="input"
          placeholder="Enter Your Email Address" />
        <p class="error-message">{{ errors?.Email }}</p>
      </div>

      <div class="form-flex-div">
        <label for="mobile">Mobile No.</label>
        <Field v-model="mobile" type="number" name="Mobile" id="mobile" class="input"
          placeholder="Enter Your Mobile Number" />
        <p class="error-message">{{ errors?.Mobile }}</p>
      </div>

      <div class="form-flex-div">
        <label for="screen">No. Of Screen</label>
        <Field v-model="screen" type="number" name="Screen" id="screen" class="input" placeholder="Enter Your Screen" />
        <p class="error-message">{{ errors?.Screen }}</p>
      </div>

      <div class="form-flex-div">
        <label for="location">Location</label>
        <Field v-model="location" type="text" name="Location" id="location" class="input"
          placeholder="Enter Your Location" />
        <p class="error-message">{{ errors?.Location }}</p>
      </div>

      <div class="form-flex-div">
        <label for="city">City</label>
        <select name="City" id="city" v-model="city" class="input" placeholder="Enter Your City">
          <option value="city">City</option>
        </select>
        <p class="error-message">{{ errors?.City }}</p>
      </div>

      <div class="block w-full">
        <label for="image" style="display:flex" class="items-center">
          Upload Image
          <ArrowUpTrayIcon
            class="r-w-10 p-1 sm:p-2 cursor-pointer border border-gray-400 hover:bg-slate-200 mx-2 rounded-full"
            v-if="!imageUrl" @click="file.click()" />
          <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
        </label>
        <div v-if="imageUrl" class="relative mat-5 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24">
          <XMarkIcon
            class="absolute w-6 sm:w-8 p-1 bg-red-500 hover:bg-red-600 cursor-pointer rounded-full -top-2 -right-2 text-white"
            @click="removeImage()" />
          <img :src="imageUrl" alt="Uploaded Image" class="w-full h-full object-cover border" />
        </div>
      </div>

      <div>
        <button type="submit" :disabled="isLoading">
          <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Update
        </button>
      </div>
    </Form>
  </div>
</template>
