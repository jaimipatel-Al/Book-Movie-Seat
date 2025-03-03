<script setup lang="ts">
  import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from "@heroicons/vue/24/solid";
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
        (val) => val && val.toString().length === 10
      ),
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

  const userName = import.meta.env.VITE_API_USER_NAME;

  const isLoading = ref(false);
  const name = ref("");
  const email = ref("");
  const mobile = ref("");
  const password = ref("");
  const confirmPassword = ref("");
  const isPassword = ref(false);
  const isConfirmPassword = ref(false);

  const signup = async () => {
    isLoading.value = true;

    const user = {
      name: name.value,
      email: email.value,
      mobile: mobile.value,
      password: password.value,
    };

    await Axios.post(api.register, user)
      .then(({ data }) => {
        const user = {
          password: password.value,
          email: email.value,
        };
        sessionStorage.setItem(userName, JSON.stringify(user));

        toast.success(data?.message ?? "User Sign Up Success!");
        router.push("/auth/login");
      })
      .catch((er) => {
        toast.error(er?.response?.data?.message ?? "User Can't Sign Up!");
      })
      .finally(() => {
        isLoading.value = false;
      });
  };
</script>

<template>
  <div class="auth-form">
    <Form @submit="signup" :validation-schema="schema" v-slot="{ errors }">
      <h1>Sign Up</h1>
      <p class="sub-line" @click="router.push('/auth/login')">
        Already Have Account Login
      </p>

      <label for="name">Name</label>
      <Field v-model="name" type="text" name="Name" id="name" class="input" placeholder="Enter Your Name" />
      <p class="error-message">{{ errors?.Name }}</p>
      <label for="email">Email Address</label>
      <Field v-model="email" type="email" name="Email" id="email" class="input"
        placeholder="Enter Your Email Address" />
      <p class="error-message">{{ errors?.Email }}</p>
      <label for="mobile">Mobile No.</label>
      <Field v-model="mobile" type="number" name="Mobile" id="mobile" class="input"
        placeholder="Enter Your Mobile Number" />
      <p class="error-message">{{ errors?.Mobile }}</p>
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

      <button type="submit">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Sign Up
      </button>
    </Form>
  </div>
</template>
