<template>
  <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
  <template v-for="data in bank">
    <template v-if="isLoading">
      <v-skeleton-loader type="paragraph"></v-skeleton-loader>
    </template>
    <CardBank
      v-else
      :Subtitle="data.code"
      :Title="data.name"
      :key="data.id_ewallet"
      class="mb-3"
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
        const response = await axios.get("http://127.0.0.1:3001/payment/bank");
        this.bank = response.data;
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching bank data:", error);
      }
    },
  },
};
</script>
