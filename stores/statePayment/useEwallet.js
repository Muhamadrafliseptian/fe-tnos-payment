import { defineStore } from "pinia";
import axios from "axios";
import CryptoJS from "crypto-js";

export const useEwalletStore = defineStore("ewallet", {
  state() {
    return {
      ewallets: [],
      isLoading: false,
      error: null,
      swal: null,
      activeWallet: null,
      activeWalletResponse: null,
    };
  },
  getters: {
    canCreateNewQr: (state) => (walletCode) => {
      return !state.activeWallet || state.activeWallet === walletCode;
    },
  },
  actions: {
    initialize() {
      if (!this.activeWallet || !this.activeWalletResponse) {
        this.getWallet();
      }
    },

    async getWallet() {
      try {
        this.isLoading = true;
        const response = await axios.get(
          "http://127.0.0.1:3001/channel_ewallet"
        );
        this.ewallets = response.data.data;
      } catch (error) {
        console.error("Error fetching bank data:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async createWallet(id, mobileNumber, cashTag) {
      console.log('halo');
      const ewalletData = JSON.parse(localStorage.getItem("ewalletData")) || {};

      const checkExistingEwallet = async () => {
        if (ewalletData[id]) {
          const expirationDate = new Date(ewalletData[id].expired_date);
          const currentDate = new Date();
          if (expirationDate > currentDate) {
            return true;
          }
        }
        return false;
      };

      try {
        if (await checkExistingEwallet()) {
          return false;
        }

        const response = await axios.post(
          "http://127.0.0.1:3001/payment/ewallet",
          { channel_code: id, mobile_number: mobileNumber, cashtag: cashTag }
        );

        let redirectUrl = null;
        switch (response.data.channel_code) {
          case "ID_DANA":
          case "ID_LINKAJA":
          case "ID_ASTRAPAY":
            redirectUrl = {
              mobile_web_checkout_url:
                response.data.actions.mobile_web_checkout_url,
            };
            break;
          case "ID_SHOPEEPAY":
            redirectUrl = {
              mobile_web_checkout_url:
                response.data.actions.mobile_deeplink_checkout_url,
            };
            break;
          default:
            break;
        }

        if (response.data.status === "PENDING") {
          ewalletData[response.data.channel_code] = {
            external_id: response.data.external_id,
            expired_date: response.data.expiration_date,
            redirectUrl,
          };

          localStorage.setItem("ewalletData", JSON.stringify(ewalletData));
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
