<template>
  <div class="d-flex">
    <b class="me-3">
      <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="this.$router.go(-1)" color="black"></v-icon>
    </b>
    <h6 class="mb-5">Bayar Dengan E-Wallet</h6>
  </div>
  <template v-for="data in bank">
    <template v-if="isLoading">
      <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    </template>
    <CardBank v-else Subtitle="lorem ipsum dolor sit amet" :Title="data.channel_name" :key="data.id_ewallet"
      class="mb-3" @click="handleRoute(data.channel_code, encryptAmount)">
      <template #avatarImage>
        <v-avatar size="90" class="ms-4" rounded="0">
          <v-img :src="logoShopee"></v-img>
        </v-avatar>
      </template>
    </CardBank>
  </template>
</template>

<script setup>
import axios from "axios";
import Shopee from '@/assets/images/bank_logos/shopee.png'
import CryptoJS from "crypto-js"
const bank = ref("")
const loading = ref(false)
const logoShopee = Shopee
const encryptAmount = ref("20000")
onMounted(() => {
  getBank()
})
const router = useRouter()
const getBank = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      "http://127.0.0.1:3001/channel_ewallet"
    );
    bank.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching bank data:", error);
  }
}

const handleRoute = (id, encryptAmount) => {
  router.push(`${encryptAmount}/${id}`)
}
</script>
