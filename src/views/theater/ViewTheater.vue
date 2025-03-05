<script setup lang="ts">
  import { ArrowPathIcon, NoSymbolIcon } from "@heroicons/vue/24/solid";
  import { onMounted, ref } from 'vue'
import Axios from '@/plugin/axios'
import api from '@/plugin/apis'
import toast from '@/plugin/toast'
import { useRoute } from 'vue-router'

const route = useRoute()

const isGetting = ref(false)
const page = ref(0)
const theaters = ref([])
const totalTheaters = ref(0)

const ownerTheater = async () => {
  if (page.value !== 0 && theaters.value?.length == totalTheaters.value) return

  isGetting.value = true
  page.value++

  await Axios.get(`${api.ownerTheater}?page=${page.value}&limit=8&ownerId=${route.params.id}`)
    .then(({ data }) => {
      const res = data.data
      theaters.value = res.theaters
      totalTheaters.value = res.total
    })
    .catch((er) => {
      toast.error(er?.response?.data?.message ?? "Theater Can't Load!")
    })
    .finally(() => {
      isGetting.value = false
    })
}

onMounted(() => {
  ownerTheater()
})
</script>

  <template>
  <div>
    <div class="main-header">
      <h2>Theaters</h2>
    </div>

    <div ref="scrollComponent" class="h-5/6 overflow-y-auto">
      <div v-for="t in theaters" :key="t._id">
        {{ t.name }}
      </div>

      <p class="loading pa-10" v-if="isGetting">
        <ArrowPathIcon class="r-w-8 mr-2" />Getting Data ...
      </p>
      <p class="loading pa-10" v-else-if="theaters.length == 0">
        <NoSymbolIcon class="r-w-8 mr-2" />No theaters found ...
      </p>
    </div>
  </div>
</template>
