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
        const virtualAccountData =
          JSON.parse(localStorage.getItem("virtualAccountData")) || {};

        // Periksa apakah virtual account dengan bank_code yang sama sudah ada
        if (virtualAccountData[id]) {
          const expirationDate = new Date(virtualAccountData[id].expired_date);
          const currentDate = new Date();
          window.location = `virtualaccount/${id}`

          // Periksa apakah expired_date masih berlaku
          if (expirationDate > currentDate) {
            console.log(
              "Cannot create a new virtual account. Existing virtual account is still active."
            );
            return;
          }
        }

        const response = await axios.post(
          "http://127.0.0.1:3001/payment/virtualaccount",
          {
            bank_code: id,
          }
        );

        if (response.data.status === "PENDING") {
          virtualAccountData[response.data.bank_code] = {
            account_number: response.data.account_number,
            invoice_id: response.data.invoice_id,
            status: response.data.status,
            external_id: response.data.external_id,
            expired_date: response.data.expiration_date,
          };

          localStorage.setItem(
            "virtualAccountData",
            JSON.stringify(virtualAccountData)
          );
          window.location = `virtualaccount/${id}`

        } else {
          console.error("Error creating VA:", response.data.errorMessage);
        }
      } catch (error) {
        console.error("An error occurred:", error.message || error);
      }
    },
  },
});
