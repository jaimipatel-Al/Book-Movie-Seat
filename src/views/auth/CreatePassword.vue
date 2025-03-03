<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";
import { Form, Field } from "vee-validate";
import * as yup from "yup";
import { ref } from "vue";
import { useRouter } from 'vue-router';

const router=useRouter()

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

const isLoading=ref(false)
const password = ref("");
const confirmPassword = ref("");
const isPassword = ref(false);
const isConfirmPassword = ref(false);

const createPassword = () => {};
</script>

<template>
  <div class="auth-form">
    <Form @submit="createPassword" :validation-schema="schema" v-slot="{ errors }">
      <h1>Create Password</h1>
      <p class="sub-line">ACreate Your New Password</p>

      <label for="password">Password</label>
      <div class="input flex items-center justify-between">
        <Field
          v-model="password"
          :type="isPassword ? 'text' : 'password'"
          name="Password"
          id="password"
          class="w-full outline-none"
          placeholder="Enter Your Password"
        />
        <div class="pl-2" @click="isPassword = !isPassword">
          <EyeSlashIcon v-if="isPassword" class="password-icon" />
          <EyeIcon v-else class="password-icon" />
        </div>
      </div>
      <p class="error-message">{{ errors?.Password }}</p>
      <label for="confirmPassword">Confirm Password</label>
      <div class="input flex items-center justify-between">
        <Field
          v-model="confirmPassword"
          :type="isConfirmPassword ? 'text' : 'password'"
          name="ConfirmPassword"
          id="confirmPassword"
          class="w-full outline-none"
          placeholder="Enter Your Confirm Password"
        />
        <div class="pl-2" @click="isConfirmPassword = !isConfirmPassword">
          <EyeSlashIcon v-if="isConfirmPassword" class="password-icon" />
          <EyeIcon v-else class="password-icon" />
        </div>
      </div>
      <p class="error-message">{{ errors?.ConfirmPassword }}</p>

      <button type="submit"><ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Create Password</button>
    </Form>
  </div>
</template>
