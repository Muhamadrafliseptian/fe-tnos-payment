import { defineStore } from "pinia";
import axios from "axios";

export const useVaStore = defineStore("virtualaccount", {
  state() {
    return {
      banks: [],
      isLoading: false,
      error: null,
      swal: null,
      activeVABank: null,
      activeVABankResponse: null,
    };
  },
  getters: {
    canCreateNewVA: (state) => (bankCode) => {
      return !state.activeVABank || state.activeVABank === bankCode;
    },
  },
  actions: {
    initialize() {
      if (!this.activeVABank || !this.activeVABankResponse) {
        this.getAllVirtualAccount();
      }
    },

    async getAllVirtualAccount() {
      try {
        this.isLoading = true;
        const response = await axios.get("http://127.0.0.1:3001/payment/bank");
        this.banks = response.data;
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createVirtualAccount(id) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:3001/payment/virtualaccount",
          {
            bank_code: id,
          }
        );
        if (response.data.status === "PENDING") {
          alert("Successfully created VA.");
        } else {
          console.error("Error creating VA:", errorMessage);
        }
      } catch (e) {
        console.error("An error occurred:", e);
      }
    },
  },
});
