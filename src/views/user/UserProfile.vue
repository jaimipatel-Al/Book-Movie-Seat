<script setup lang="ts">
  import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/vue/24/solid";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import { onMounted, ref } from "vue";
  import Axios from "@/plugin/axios";
  import api from "@/plugin/apis";
  import toast from "@/plugin/toast";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()

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
  });

  const isGetting = ref(false);
  const isLoading = ref(false);
  const name = ref("");
  const email = ref("");
  const mobile = ref("");
  const image = ref();
  const imageUrl = ref();
  const file = ref();

  const handleFileUpload = (event: Event) => {
    const file = event.target?.files?.[0] ?? "";
    if (file) {
      image.value = file;
      imageUrl.value = URL.createObjectURL(file);
    }
  };
  const removeImage = () => {
    imageUrl.value = null;
    image.value = null;
    file.value.value = null;
  };

  const updateUserProfile = async () => {
    isLoading.value = true;

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("mobile", mobile.value);
    if (image.value || (!imageUrl.value && !image.value)) formData.append('image', image.value ? image.value : '')

    await Axios.put(api.updateUserProfile, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(({ data }) => {
        toast.success(data?.message ?? "User Profile Updated Successfully!");
      authStore.loginUser({...authStore.userData,...data.data})
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "User Profile Can't Update!");
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  const getUser = async () => {
    isGetting.value = true;

    await Axios.get(api.getUser)
      .then(({ data }) => {
        const res = data.data;

        email.value = res.email;
        name.value = res.name;
        mobile.value = res.mobile;
        imageUrl.value = res.image;
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "User Can't Load!");
      })
      .finally(() => {
        isGetting.value = false;
      });
  };

  onMounted(() => {
    getUser();
  });
</script>

<template>
  <div class="add-edit-form">
    <h2>Update Your Profile</h2>

    <p class="loading" v-if="isGetting">
      <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
    </p>
    <Form v-else class="edit-user-form" @submit="updateUserProfile" :validation-schema="schema" v-slot="{ errors }">
      <div class="form-flex-div">
        <label for="name">Name</label>
        <Field v-model="name" type="text" name="Name" id="name" class="input" placeholder="Enter Your Name" />
        <p class="error-message">{{ errors?.Name }}</p>
      </div>

      <div class="form-flex-div">
        <label for="email">Email Address</label>
        <Field v-model="email" type="email" name="Email" id="email" class="input" disabled
          placeholder="Enter Your Email Address" />
        <p class="error-message">{{ errors?.Email }}</p>
      </div>

      <div class="form-flex-div">
        <label for="mobile">Mobile No.</label>
        <Field v-model="mobile" type="number" name="Mobile" id="mobile" class="input"
          placeholder="Enter Your Mobile Number" />
        <p class="error-message">{{ errors?.Mobile }}</p>
      </div>

      <div class="block w-full">
        <label for="image" style="display: flex" class="items-center">
          Upload Image
          <ArrowUpTrayIcon
            class="r-w-10 p-1 sm:p-2 cursor-pointer border border-gray-400 hover:bg-slate-200 mx-2 rounded-full"
            v-if="!imageUrl" @click="file.click()" />
          <input type="file" accept="image/*" ref="file" hidden @change="handleFileUpload" />
        </label>
        <div v-if="imageUrl" class="relative mat-5 w-20 sm:w-24 md:w-32 h-1w-20 sm:h-24 md:h-32">
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
