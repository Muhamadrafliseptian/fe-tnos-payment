<template>
  <h6 class="mb-5">Bayar Dengan E-Wallet</h6>
  <template v-for="data in bank">
    <template v-if="isLoading">
      <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    </template>
    <CardBank
      v-else
      :Subtitle="data.channel_code"
      :Title="data.channel_name"
      :key="data.id_ewallet"
      class="mb-3"
      @click="handleRoute(data.channel_code)"
    />
  </template>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      bank: [],
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
