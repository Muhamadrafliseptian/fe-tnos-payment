import { defineStore } from "pinia";
import axios from "axios";
import CryptoJS from "crypto-js";
import { useRouter } from "vue-router";
import { decryptData } from "~/pages/utils/decrypt";

const config = useRuntimeConfig();

export const useQrStore = defineStore("qrcode", {
  state() {
    return {
      qrcodes: [],
      isLoading: false,
      error: null,
      swal: null,
      activeQr: null,
      activeQrResponse: null,
    };
  },
  getters: {
    canCreateNewQr: (state) => (channelCode) => {
      return !state.activeQr || state.activeQr === channelCode;
    },
  },
  actions: {
    initialize() {
      if (!this.activeQr || !this.activeQrResponse) {
        this.getQr();
      }
    },

    async getQr() {
      try {
        this.isLoading = true;
        const response = await axios.get(`${config.public.apiBase}/qr_code`);
        this.qrcodes = decryptData(response.data.data)
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createQrCode(id) {
      const qrCodeData = JSON.parse(localStorage.getItem("qrCodeData")) || {};

      const checkExistingQr = async () => {
        if (qrCodeData[id]) {
          const expirationDate = new Date(
            CryptoJS.AES.decrypt(
              qrCodeData[id].expired_date,
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
        if (await checkExistingQr()) {
          return false;
        }

        const response = await axios.post(
          `${config.public.apiBase}/payment/qrcode`,
          { channel_code: id }
        );

        if (response.data.status === "ACTIVE") {
          const encryptedData = handleEncryption({
            external_id: response.data.external_id,
            expired_date: response.data.expires_at,
          });

          qrCodeData[response.data.channel_code] = encryptedData;

          localStorage.setItem("qrCodeData", JSON.stringify(qrCodeData));
          return true;
        } else {
          console.error("Error creating Qr:", response.data.errorMessage);
          return false;
        }
      } catch (error) {
        console.error("An error occurred:", error.message || error);
      }
    },
  },
});
