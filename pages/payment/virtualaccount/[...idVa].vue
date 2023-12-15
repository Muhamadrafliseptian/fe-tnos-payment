<template>
  <b>
    <v-icon
      icon="mdi mdi-keyboard-backspace"
      class="mb-3"
      @click="router.back(-1)"
      color="black"
    ></v-icon>
  </b>
  <div v-if="messageExpired" class="mt-3 text-center">
    <!-- <p class="mb-0">{{ messageExpired }}</p>
    <p class="mb-0">Silahkan pilih metode pembayaran lagi</p>
    <v-btn
      class="text-caption"
      text="kembali"
      width="100"
      color="blue"
      @click="router.back(-1)"
    ></v-btn> -->
  </div>
  <div v-else>
    <v-card color="grey-lighten-5" class="text-caption">
      <v-card-text>
        <h6 color="indigo">{{ route.params.idVa[0] }}</h6>
        <p class="mb-0">
          Status: <b>{{ transactionData?.status }}</b>
        </p>
        <p class="mb-0" hidden>
          Sisa waktu pembayaran: <b>{{ countdown }}</b>
        </p>
        <p class="mb-0">
          Tenggat Waktu Pembayaran: <b>{{ expireDate }} WIB</b>
        </p>
        <p class="mb-0">
          Virtual Account: <b>{{ transactionData?.account_number }}</b>
        </p>
      </v-card-text>
    </v-card>
    <h6 class="mt-5">Tata cara bayar dari ATM {{ route.params.idVa[0] }}</h6>
    <v-card class="mt-4">
      <v-container>
        <v-timeline density="compact" side="end">
          <v-timeline-item
            class="mb-4"
            dot-color="indigo"
            size="small"
            v-for="(item, index) in datas"
            :key="index"
          >
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
const { $swal } = useNuxtApp();
const vaStore = useVaStore();
const transactionData = ref();
const messageExpired = ref();
const expireDate = ref("");
const route = useRoute();
const router = useRouter();
const countdown = ref("");
const datas = [
  "Masukkan Virtual Account yang Anda ingin bayarkan",
  "Masukan nominal, kemudian pilih Lanjutkan",
  "Konfirmasi Transaksi kemudian Lanjut Transfer",
  "Masukkan Pin Aplikasi",
  "Pembayaran Berhasil",
];

vaStore.setPaymentSuccess(true)

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

    const externalId = getExternalIdFromLocalStorage(route.params.idVa[0]);
    const response = await axios.get(
      `http://localhost:3001/payment/INV-TNOS123/${route.params.idVa[0]}/${externalId}/get`
    );

    if (paymentProcessed) {
      return;
    }

    const expirationDateUTC = new Date(response.data.expiration_date);
    const options = { timeZone: "Asia/Jakarta" };
    const expirationDateLocal = expirationDateUTC.toLocaleString(
      "id-ID",
      options
    );
    transactionData.value = response.data;
    expireDate.value = expirationDateLocal;

    if (response.data.status !== "PAID") {
      timerId = setTimeout(getData, 5000);
      messageExpired.value = response.data.message;
    } else {
      paymentProcessed = true;
      clearTimeout(timerId);
      clearVirtualAccountData();
      $swal
        .fire({
          title: "Success!",
          text: "Berhasil melakukan pembayaran",
          icon: "success",
          showConfirmButton: true,
        })
        .then(() => {
          router.push('/redirect_payment')
        });
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

const getExternalIdFromLocalStorage = (bankCode) => {
  const dataVirtualAccount =
    JSON.parse(localStorage.getItem("virtualAccountData")) || {};
  const encryptedExternalId = dataVirtualAccount[bankCode]?.external_id;

  if (encryptedExternalId) {
    try {
      const decryptedExternalId = CryptoJS.AES.decrypt(
        encryptedExternalId,
        "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
      ).toString(CryptoJS.enc.Utf8);
      return decryptedExternalId;
    } catch (error) {
      console.error("Error decrypting external_id:", error.message || error);
      return null;
    }
  }

  return null;
};
</script>
