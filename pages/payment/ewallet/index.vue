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
          const response = await axios.get("https://2037-2001-448a-2082-4433-cd47-1301-6e3e-3bab.ngrok-free.app/channel_ewallet");
          this.bank = response.data.data;
          this.isLoading = false;
        } catch (error) {
          console.error("Error fetching bank data:", error);
        }
      },
    },
  };
  </script>
  