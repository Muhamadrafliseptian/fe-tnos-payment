import { defineStore } from "pinia";
import axios from "axios";
import CryptoJS from "crypto-js";
import { decryptData } from "~/pages/utils/decrypt";

const config = useRuntimeConfig();

export const useVaStore = defineStore("virtualaccount", {
  state() {
    return {
      banks: [],
      isLoading: false,
      error: null,
      swal: null,
      activeVABank: null,
      activeVABankResponse: null,
      paymentSuccess: false,
    };
  },
  getters: {
    canCreateNewVA: (state) => (bankCode) => {
      return !state.activeVABank || state.activeVABank === bankCode;
    },
  },
  actions: {
    setPaymentSuccess(success) {
      this.paymentSuccess = success;
    },
    initialize() {
      if (!this.activeVABank || !this.activeVABankResponse) {
        this.getAllVirtualAccount();
      }
    },

    async getAllVirtualAccount() {
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.public.apiBase}/payment/bank`);
        this.banks = decryptData(response.data);
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createVirtualAccount(id, encryptAmount) {
      const virtualAccountData =
        JSON.parse(localStorage.getItem("virtualAccountData")) || {};

      const checkExistingVirtualAccount = async () => {
        if (virtualAccountData[id]) {
          const expirationDate = new Date(
            CryptoJS.AES.decrypt(
              virtualAccountData[id].expired_date,
              "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
            ).toString(CryptoJS.enc.Utf8)
          );
          const currentDate = new Date();
          if (expirationDate > currentDate) {
            return true;
          }
        }
        return false;
      };

      const handleEncryption = (data) => {
        const encryptedData = {};
        for (const key in data) {
          encryptedData[key] = CryptoJS.AES.encrypt(
            data[key],
            "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
          ).toString();
        }
        return encryptedData;
      };

      try {
        if (await checkExistingVirtualAccount()) {
          return false;
        }

        const response = await axios.post(
          `${config.public.apiBase}/payment/virtualaccount`,
          { bank_code: id, amount: encryptAmount }
        );

        if (response.data.status === "PENDING") {
          const encryptedData = handleEncryption({
            account_number: response.data.account_number,
            external_id: response.data.external_id,
            expired_date: response.data.expiration_date,
          });

          virtualAccountData[response.data.bank_code] = encryptedData;

          localStorage.setItem(
            "virtualAccountData",
            JSON.stringify(virtualAccountData)
          );
          return true;
        } else {
          console.log(response.data.error.message);
          return false;
        }
      } catch (error) {
        console.error("An error occurred:", error.message || error);
      }
    },
  },
});
