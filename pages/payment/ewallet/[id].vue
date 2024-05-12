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
    <CardBank v-else :Subtitle="data.channel_name" :Title="data.channel_name" :key="data.id_ewallet"
      class="mb-3" @click="handleRoute(data.channel_code, urlParams)">
      <template #avatarImage>
        <v-avatar size="90" class="ms-4" rounded="0">
          <v-img :src="getEwalletLogo(data.channel_name)"></v-img>
        </v-avatar>
      </template>
    </CardBank>
  </template>
</template>

<script setup>
import axios from "axios";
import LOGO_OVO from "@/assets/images/logo_ewallet/E-WALLET_OVO.png";
import LOGO_LINK_AJA from "@/assets/images/logo_ewallet/E-WALLET_Link Aja.png";
import LOGO_ASTRAPAY from "@/assets/images/logo_ewallet/E-WALLET_AstraPay.png";

const config = useRuntimeConfig();
const bank = ref("")
const loading = ref(false)
const router = useRouter()
const urlParams = router.currentRoute.value.fullPath.split('/').slice(3).join('/')

onMounted(() => {
  getBank()
})

const imageLogos = {
  OVO: LOGO_OVO,
  LINK_AJA: LOGO_LINK_AJA,
  ASTRAPAY: LOGO_ASTRAPAY
}

const getEwalletLogo = (code) => {
  return imageLogos[code]
}

const getBank = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      `${config.public.apiBase}/channel_ewallet`
    );
    bank.value = response.data.data;
    loading.value = false;
  } catch (error) {
    console.error("Error fetching bank data:", error);
  }
}

const handleRoute = (id, paramsUrl) => {
  router.push(`${paramsUrl}/${id}`)
}
</script>
