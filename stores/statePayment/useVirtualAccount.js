import { defineStore } from "pinia";
import axios from "axios";
import createPersistedState from "pinia-persistedstate";

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
    plugins:
      typeof window !== "undefined"
        ? [createPersistedState({ key: "vaStore", paths: ["activeVABank"] })]
        : [],

    initialize() {
      this.getAllVirtualAccount();
      const persistedState = this.$state;
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
          console.error(
            `Cannot create a new VA for ${id}. There is an active VA for ${this.activeVABank}.`
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
          console.log("Successfully created VA.");
          window.location = `virtualaccount/${this.activeVABank}`;
        } else {
          const errorMessage = response.data.error
            ? response.data.error.message
            : "An error occurred.";
          console.error("Error creating VA:", errorMessage);
        }
      } catch (e) {
        console.error("An error occurred:", e);
      }
    },
  },
});