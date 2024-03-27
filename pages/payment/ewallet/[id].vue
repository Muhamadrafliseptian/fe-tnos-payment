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
    <CardBank v-else Subtitle="lorem ipsum dolor sit amet" :Title="data.channel_name" :key="data.id_ewallet" class="mb-3"
      @click="handleRoute(data.channel_code, encryptAmount)">
      <template #avatarImage>
        <v-avatar size="90" class="ms-4" rounded="0">
          <v-img :src="logoShopee"></v-img>
        </v-avatar>
      </template>
    </CardBank>
  </template>
</template>

<script>
import axios from "axios";
import Shopee from '@/assets/images/bank_logos/shopee.png'
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js"


export default {
  data() {
    return {
      bank: [],
      logoShopee: Shopee,
      isLoading: false,
      urlParams: '',
      encryptAmount: 0
    };
  },

  async created() {
    this.urlParams = this.$route.fullPath.split("/").slice(3).join("/")
    const splitAmount = this.urlParams.split('|')[1]
    this.encryptAmount = CryptoJS.AES.decrypt(atob(splitAmount), 'U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=').toString(CryptoJS.enc.Utf8);

    await this.getBank();
  },

  methods: {
    async getBank() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "http://127.0.0.1:3001/channel_ewallet"
        );
        this.bank = response.data.data;
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    },
    handleRoute(id, encryptAmount) {
      this.$router.push(`${this.urlParams}/${id}`)
      // this.$router.push(`/payment/ewallet/channel/${id}/${encryptAmount}`);
    },
  },
};
</script>
