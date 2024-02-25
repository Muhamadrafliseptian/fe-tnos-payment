<template>
    <b>
      <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.back(-1)" color="black"></v-icon>
    </b>
    <div>
      <v-card color="grey-lighten-5" class="text-caption">
        <v-card-text>
          <h6 color="indigo">{{ route.params.id }}</h6>
          <p class="mb-0">
            Status: <b>{{ transactionData?.status }}</b>
          </p>
          <p class="mb-0" hidden>
            Sisa waktu pembayaran: <b>{{ countdown }}</b>
          </p>
          <p class="mb-0">
            Tenggat Waktu Pembayaran: <b>{{ expireDate }} WIB</b>
          </p>
          <p v-if="countdown" class="mb-0">
            Sisa waktu pembayaran: <b> {{ countdown }} </b>
          </p>
          <p class="mb-0">
            Virtual Account: <b>{{ transactionData?.account_number }}</b>
          </p>
        </v-card-text>
      </v-card>
      <h6 class="mt-5">Tata cara bayar dari ATM {{ route.params.id }}</h6>
      <v-card class="mt-4">
        <v-container>
          <v-timeline density="compact" side="end">
            <v-timeline-item class="mb-4" dot-color="indigo" size="small" v-for="(item, index) in datas" :key="index">
              <div>
                {{ item }}
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-container>
      </v-card>
    </div>
  </template>
  
  <script setup>
  import CryptoJS from "crypto-js";
  import { ref, onMounted } from "vue";
  import axios from "axios";
  import { useVaStore } from "@/stores/statePayment/useVirtualAccount";
  import { useRedirect } from "~/stores/statePayment/useRedirect";
  import { decryptData } from "~/pages/utils/decrypt";
  const { $swal } = useNuxtApp();
  const vaStore = useVaStore();
  const redirectStore = useRedirect();
  const transactionData = ref();
  const messageExpired = ref();
  const expireDate = ref("");
  const route = useRoute();
  const router = useRouter();
  const countdown = ref("");
  const expirationDates = ref("");
  const waktu = ref("");
  const datas = [
    "Masukkan Virtual Account yang Anda ingin bayarkan",
    "Masukan nominal, kemudian pilih Lanjutkan",
    "Konfirmasi Transaksi kemudian Lanjut Transfer",
    "Masukkan Pin Aplikasi",
    "Pembayaran Berhasil",
  ];
  
  redirectStore.setPaymentSuccess(true);
  
  let timerId;
  let paymentProcessed = false;
  
  onMounted(() => {
    vaStore.initialize();
    getData();
  });
  
  onUnmounted(() => {
    clearTimeout(timerId);
  });

  const getData = async () => {
    try {
      if (paymentProcessed) {
        return;
      }
  
      const externalId = getValueFromLocalStorage(route.params.id, 'external_id');
      const response = await axios.get(
        `http://localhost:3001/payment/INV-TNOS123/${route.params.id}/${externalId}/get`
      );
  
      if (paymentProcessed) {
        return;
      }
  
      const decrypt = decryptData(response.data);
  
      const expiredDate = getValueFromLocalStorage(route.params.id, 'expired_date');
  
      const expirationDateUTC = new Date(decrypt.expiration_date);
      const options = { timeZone: "Asia/Jakarta" };
      const expirationDateLocal = expirationDateUTC.toLocaleString(
        "id-ID",
        options
      );
      transactionData.value = decrypt;
      expireDate.value = expirationDateLocal;
  
      expirationDates.value = new Date(expiredDate);
  
      const datess = new Date();
  
      const sisaWaktu = expirationDates.value - datess;
  
      const menit = Math.floor(sisaWaktu / (1000 * 60));
      const detik = Math.floor((sisaWaktu % (1000 * 60)) / 1000);
  
      waktu.value = `${menit} menit ${detik} detik`;
  
      countdown.value = waktu.value;
  
      if (sisaWaktu < 0) {
        removeKeyFromLocalStorage(route.params.id);
        router.push('/payment/virtualaccount')
      }

      console.log(decrypt.status);
  
      if (decrypt.status !== "PAID") {
        timerId = setTimeout(getData, 1000);
        messageExpired.value = decrypt.message;
      } else {
        paymentProcessed = true;
        clearTimeout(timerId);
        clearVirtualAccountData();
        router.push("/redirect_payment");
      }
    } catch (er) {
      console.log(er);
    }
  };
  
  const clearVirtualAccountData = () => {
    localStorage.removeItem("virtualAccountData");
    localStorage.removeItem("qrCodeData");
    localStorage.removeItem("ewalletData");
  };
  
  const getValueFromLocalStorage = (bankCode, fieldName) => {
    const dataVirtualAccount =
      JSON.parse(localStorage.getItem("virtualAccountData")) || {};
    const encryptedValue = dataVirtualAccount[bankCode]?.[fieldName];
  
    if (encryptedValue) {
      try {
        const decryptedValue = CryptoJS.AES.decrypt(
          encryptedValue,
          "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
        ).toString(CryptoJS.enc.Utf8);
        return decryptedValue;
      } catch (error) {
        console.error(`Error decrypting ${fieldName}:`, error.message || error);
        return null;
      }
    }
  
    return null;
  };
  
  const removeKeyFromLocalStorage = (bankCode) => {
    const dataVirtualAccount =
      JSON.parse(localStorage.getItem("virtualAccountData")) || {};
  
    if (dataVirtualAccount.hasOwnProperty(bankCode)) {
      delete dataVirtualAccount[bankCode];
      localStorage.setItem("virtualAccountData", JSON.stringify(dataVirtualAccount));
    }
  };
  
  </script>