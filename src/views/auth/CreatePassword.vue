<script setup lang="ts">
  import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";
  import { Form, Field } from "vee-validate";
  import * as yup from "yup";
  import { onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import Axios from "@/plugin/axios";
  import api from "@/plugin/apis";
  import toast from "@/plugin/toast";

  const route = useRoute();
  const router = useRouter();

  const schema = yup.object({
    Password: yup
      .string()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    ConfirmPassword: yup
      .string()
      .required("Confirm Password is required")
      .oneOf([yup.ref("Password"), ""], "Passwords must match"),
  });

  const isVerifying = ref(false);
  const isLoading = ref(false);
  const password = ref("");
  const confirmPassword = ref("");
  const isPassword = ref(false);
  const isConfirmPassword = ref(false);

  const createPassword = async () => {
    isLoading.value = true;

    const user = {
      token: route.query.token,
      newPassword: password.value,
    };

    await Axios.post(api.setPassword, user)
      .then(({ data }) => {
        toast.success(data?.message ?? "Your Password Created Successfully!");
        router.push('/user/profile')
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "Password Can't Create!");
      })
      .finally(() => {
        isLoading.value = false;
      });
  };
  const verifyToken = async () => {
    isVerifying.value = true;

    await Axios.get(`${api.verifyToken}${route.query.token}`)
      .then(({ data }) => {
        if(data.success)
        toast.success('Please Create New Password.')
      })
      .catch((er) => {
        // Not Verifying
      })
      .finally(() => {
        isVerifying.value = false;
      });
  };

  onMounted(() => {
    if (route?.query?.token) verifyToken();
  });
</script>

<template>
  <div class="auth-form">
    <Form @submit="createPassword" :validation-schema="schema" v-slot="{ errors }">
      <h1>Create Password</h1>
      <p class="sub-line">ACreate Your New Password</p>

      <label for="password">Password</label>
      <div class="input flex items-center justify-between">
        <Field v-model="password" :type="isPassword ? 'text' : 'password'" name="Password" id="password"
          class="w-full outline-none" placeholder="Enter Your Password" />
        <div class="pl-2" @click="isPassword = !isPassword">
          <EyeSlashIcon v-if="isPassword" class="password-icon" />
          <EyeIcon v-else class="password-icon" />
        </div>
      </div>
      <p class="error-message">{{ errors?.Password }}</p>
      <label for="confirmPassword">Confirm Password</label>
      <div class="input flex items-center justify-between">
        <Field v-model="confirmPassword" :type="isConfirmPassword ? 'text' : 'password'" name="ConfirmPassword"
          id="confirmPassword" class="w-full outline-none" placeholder="Enter Your Confirm Password" />
        <div class="pl-2" @click="isConfirmPassword = !isConfirmPassword">
          <EyeSlashIcon v-if="isConfirmPassword" class="password-icon" />
          <EyeIcon v-else class="password-icon" />
        </div>
      </div>
      <p class="error-message">{{ errors?.ConfirmPassword }}</p>

      <button type="submit" :disabled="isLoading">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Create Password
      </button>
    </Form>
  </div>
</template>
