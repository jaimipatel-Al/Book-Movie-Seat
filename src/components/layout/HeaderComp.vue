<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  UserIcon,
  ChevronDoubleRightIcon,
  FilmIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import toast from '@/plugin/toast'

const router = useRouter()
const authStore = useAuthStore()

const menus = [
  {
    isShow: authStore?.userData?.role == 'super_admin',
    title: 'Owners',
    page: '/owner',
  },
  {
    isShow: authStore?.userData?.role == 'sub_admin',
    title: 'Theaters',
    page: '/theater',
  },
]

const searchMovie = ref('')

const isLogin = computed(() => (authStore.userData?.token ? true : false))
const userName = computed(() => authStore.userData?.name ?? 'Guest')

const searchingMovie = () => {}
const signOut = () => {
  authStore.logOut()
  toast.success('User Logged Out successfully')
  router.push('/auth/login')
}

const openSidebar = () => {
  document.getElementById('sidebar')?.classList.add('open')
  document.getElementById('overlay')?.classList.add('active')
}
const closeSidebar = () => {
  setTimeout(() => {
    document.getElementById('sidebar')?.classList.remove('open')
    document.getElementById('overlay')?.classList.remove('active')
  }, 200)
}
const openSearch = () => {
  document.getElementById('searchbar')?.classList.add('open')
}
const closeSearch = () => {
  setTimeout(() => {
    document.getElementById('searchbar')?.classList.remove('open')
  }, 200)
}
</script>

<template>
  <header class="pay-5 pax-10 flex justify-between">
    <div class="flex r-space-x-3">
      <div
        class="flex items-center r-text-3xl cursor-pointer text-gray-600"
        @click="router.push('/')"
      >
        <img src="@/assets/img/icon.svg" alt="Logo" class="w-8 sm:w-10 md:w-12" />
        <h1 class="mx-1">Book<span class="italic text-blue-700">Movie</span>Seat</h1>
      </div>
      <div class="hidden sm:flex r-space-x-3 border border-gray-400 rounded-xl w-72 md:w-96">
        <MagnifyingGlassIcon class="w-5 md:w-6 text-gray-500 mx-1 md:mx-2" />
        <input
          v-model="searchMovie"
          type="search"
          class="w-full text-base md:text-lg px-2 md:px-3 py-1 md:py-2 rounded-xl placeholder:text-gray-400 outline-none text-gray-600"
          placeholder="Search Your Movie"
          @input="searchingMovie()"
        />
      </div>
    </div>
    <div class="flex r-space-x-3 items-center">
      <div
        v-if="isLogin"
        class="flex items-center cursor-pointer"
        @click="router.push('/user/profile')"
      >
        <UserIcon
          class="r-w-10 p-1 rounded-full border border-gray-400 text-gray-400 mx-1 md:mx-2"
        />
        <span class="text-gray-700 text-sm sm:text-base md:text-lg">Hi, {{ userName }}</span>
      </div>
      <button v-else class="blue-btn text-normal" @click="router.push('/auth/signup')">
        Sign Up
      </button>
      <MagnifyingGlassIcon
        class="block sm:hidden w-6 md:w-8 cursor-pointer"
        @click="openSearch()"
      />
      <Bars3Icon class="w-6 md:w-8 cursor-pointer" @click="openSidebar()" />
    </div>

    <div class="overlay" id="overlay" @click="closeSidebar()"></div>
    <nav class="sidebar" id="sidebar" @click="closeSidebar()">
      <div class="navigation">
        <ul>
          <li>
            <h2 class="r-text-2xl">
              <p class="flex items-center cursor-pointer">
                <ChevronLeftIcon
                  class="block sm:hidden w-6 p-1 hover:bg-slate-200 rounded-full mr-1"
                />
                Hey{{ isLogin ? `, ${userName}` : '!' }}
              </p>
              <p
                v-if="isLogin"
                class="flex items-center text-xs sm:text-sm hover:underline hover:text-blue-600 cursor-pointer font-normal"
                @click="router.push('/user/profile')"
              >
                Edit Profile
                <ChevronDoubleRightIcon class="w-2 sm:w-3 mx-1" />
              </p>
            </h2>
            <UserIcon
              v-if="isLogin"
              class="r-w-10 p-1 rounded-full border border-gray-400 text-gray-400 mx-2"
            />
          </li>
          <li v-if="!isLogin">
            <div class="flex items-center text-gray-600 text-normal">
              <FilmIcon class="p-1 sm:p-2 w-10 sm:w-12 border rounded-full mr-1 sm:mr-2" />
              Secure Your Seat: Book Your Movie Ticket Now!
            </div>
            <button class="blue-outline text-normal t-nowrap" @click="router.push('/auth/login')">
              Sign Up
            </button>
          </li>

          <template v-for="i in menus" :key="i.page">
            <li v-if="i.isShow" @click="router.push(i.page)">
              {{ i.title }}
              <ChevronRightIcon class="r-w-8 p-1 rounded-full cursor-pointer hover:bg-slate-200" />
            </li>
          </template>
        </ul>
        <button v-if="isLogin" class="blue-outline ma-5" @click="signOut()">Sign Out</button>
      </div>
    </nav>

    <div class="searchbar" id="searchbar">
      <div class="flex r-space-x-3 border-b">
        <ChevronLeftIcon class="w-10 px-2 text-gray-900 mr-5 cursor-pointer" @click="closeSearch" />
        <MagnifyingGlassIcon class="w-6 text-gray-500" />
        <input
          v-model="searchMovie"
          type="search"
          class="w-full text-base py-3 px-1 rounded-xl placeholder:text-gray-400 outline-none text-gray-600"
          placeholder="Search Your Movie"
          @input="searchingMovie()"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: none;
}

.overlay.active {
  display: block;
}

.sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100%;
  background: #fff;
  transition: 0.3s;
}

.sidebar.open {
  box-shadow: 0px 0px 12px 0px #999;
  right: 0;
  z-index: 10;
}

.searchbar {
  position: fixed;
  top: 0;
  right: -100vw;
  width: 100vw;
  height: 100%;
  background: #fff;
  transition: 0.3s;
}

.searchbar.open {
  right: 0;
  z-index: 10;
}

@media screen and (max-width: 640px) {
  .sidebar {
    right: -200px;
    width: 200px;
    max-width: 100vw;
  }
}

@media screen and (max-width: 768px) {
  .sidebar {
    right: -300px;
    width: 300px;
  }
}
</style>
