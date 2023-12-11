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
      this.getAllVirtualAccount();
    },

    async getAllVirtualAccount() {
      try {
        this.isLoading = true;
        const response = await axios.get("http://127.0.0.1:3001/payment/bank");
        this.banks = response.data;
      } catch (error) {
        console.error("Error fetching bank data:", error);
        this.error = "Error fetching bank data";
      } finally {
        this.isLoading = false;
      }
    },
    async createVirtualAccount(id) {
      try {
        const bankData = this.banks.find((bank) => bank.code === id);

        if (!this.canCreateNewVA(id)) {
          alert(
            `Tidak bisa bikin VA untuk ${id}. Karena masih aktif VA ${this.activeVABank}.`
          );
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:3001/payment/virtualaccount",
          {
            bank_code: id,
          }
        );

        this.activeVABankResponse = response.data;

        if (response.data.status === "PENDING") {
          this.activeVABank = id;
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
