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
      @click="handleRoute(data.channel_code)">
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

export default {
  data() {
    return {
      bank: [],
      logoShopee: Shopee,
      isLoading: false,
    };
  },

  async created() {
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
    handleRoute(id) {
      this.$router.push(`/payment/ewallet/channel/${id}`);
    },
  },
};
</script>
