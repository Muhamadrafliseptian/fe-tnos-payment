import { defineStore } from "pinia";
import axios from "axios";
import CryptoJS from "crypto-js";

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
        const response = await axios.get("http://127.0.0.1:3001/qr_code");
        this.qrcodes = response.data.data;
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
              "your-secret-key"
            ).toString(CryptoJS.enc.Utf8)
          );
          const currentDate = new Date();
          if (expirationDate > currentDate) {
            console.log(
              "Cannot create a new qr code. Existing qr code is still active."
            );
            window.location = `/qrcode/${id}`;
            return false;
          }
        }
        return false;
      };

      const handleEncryption = (data) => {
        const encryptedData = {};
        for (const key in data) {
          encryptedData[key] = CryptoJS.AES.encrypt(
            data[key],
            "your-secret-key"
          ).toString();
        }
        return encryptedData;
      };

      try {
        if (await checkExistingQr()) {
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:3001/payment/qrcode",
          { channel_code: id }
        );

        if (response.data.status === "ACTIVE") {
          const encryptedData = handleEncryption({
            invoice_id: response.data.invoice_id,
            status: response.data.status,
            external_id: response.data.external_id,
            expired_date: response.data.expires_at,
          });

          qrCodeData[response.data.channel_code] = encryptedData;

          localStorage.setItem("qrCodeData", JSON.stringify(qrCodeData));
          window.location = `/qrcode/${id}`;
        } else {
          console.error("Error creating Qr:", response.data.errorMessage);
        }
      } catch (error) {
        console.error("An error occurred:", error.message || error);
      }
    },
  },
});
