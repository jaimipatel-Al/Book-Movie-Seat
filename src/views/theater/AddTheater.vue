<script setup lang="ts">
  import { ArrowPathIcon } from '@heroicons/vue/24/solid'
  import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Axios from "@/plugin/axios";
import api from "@/plugin/apis";
import toast from "@/plugin/toast";

const router = useRouter();

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

const isLoading = ref(false);
const name = ref("");
const email = ref("");
const mobile = ref("");

const addTheater =async  () => {
  isLoading.value = true;

  const user = {
    name: name.value,
    email: email.value,
    mobile: mobile.value,
  };

  await Axios.post(api.addTheater, user)
    .then(({ data }) => {
      toast.success(data?.message ?? "Theater Added Successfully!");
      router.push("/theater");
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Add!");
    })
    .finally(() => {
      isLoading.value = false;
    });
};
</script>

<template>
  <div class="add-edit-form">
    <h2>
      Add Theater
      <span @click="router.push('/theater')"> Back To List </span>
    </h2>

    <Form class="add-theater-form" @submit="addTheater" :validation-schema="schema" v-slot="{ errors }">
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
      <label for="email">Email Address</label>
      <Field
        v-model="email"
        type="email"
        name="Email"
        id="email"
        class="input"
        placeholder="Enter Your Email Address"
      />
      <p class="error-message">{{ errors?.Email }}</p>
      <label for="mobile">Mobile No.</label>
      <Field
        v-model="mobile"
        type="number"
        name="Mobile"
        id="mobile"
        class="input"
        placeholder="Enter Your Mobile Number"
      />
      <p class="error-message">{{ errors?.Mobile }}</p>

      <button type="submit" :disabled="isLoading">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Add Theater
      </button>
    </Form>
  </div>
</template>
