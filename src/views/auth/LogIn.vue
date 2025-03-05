<script setup lang="ts">
import { EyeIcon, EyeSlashIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import swal from '@/plugin/sweetalert'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const schema = yup.object({
  Email: yup.string().required().email(),
  Password: yup
    .string()
    .required()
    .min(8)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
})

const userName = computed(() => authStore.userName)

const isLoading = ref(false)
const email = ref('')
const password = ref('')
const isPassword = ref(false)
const isRemember = ref(false)

const login = async () => {
  isLoading.value = true

  const user = {
    email: email.value,
    password: password.value,
  }

  await Axios.post(api.login, user)
    .then(({ data }) => {
      if (isRemember.value) {
        const user = {
          password: password.value,
          email: email.value,
        }
        sessionStorage.setItem(userName.value, JSON.stringify(user))
      } else sessionStorage.removeItem(userName.value)

      authStore.loginUser(data.data)
      toast.success(data?.message ?? 'User Login Success!')

      if (data.data.role == 'sub_admin' && !data.data.isActive) {
        swal
          .fire({
            title: 'Deactivate Account',
            text: 'Your account is deactivated by system.',
            icon: 'warning',
            showCancelButton: false,
          })
          .then((result) => {
            if (result.isConfirmed) router.push('/')
          })
      } else router.push('/')
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "User Can't Login!")
    })
    .finally(() => {
      isLoading.value = false
    })
}

onMounted(() => {
  const authUser = sessionStorage.getItem(userName.value)

  if (authUser) {
    const user = JSON.parse(authUser)
    email.value = user.email
    password.value = user.password
    isRemember.value = true
  }
})
</script>

<template>
  <div class="auth-form">
    <Form @submit="login" :validation-schema="schema" v-slot="{ errors }">
      <h1>Login</h1>
      <p class="sub-line" @click="router.push('/auth/signup')">Create New Account</p>

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
      <label for="remember">
        <input v-model="isRemember" type="checkbox" id="remember" class="w-4 h-4 cursor-pointer" />
        Remember Me
      </label>

      <button type="submit" :disabled="isLoading">
        <ArrowPathIcon v-if="isLoading" class="r-w-8 mr-2" /> Login
      </button>
    </Form>
  </div>
</template>
