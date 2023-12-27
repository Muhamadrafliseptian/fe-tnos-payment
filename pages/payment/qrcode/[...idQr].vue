<template>
  <v-container>
    {{ countdown }}
    <h6>Status Pembayaran: {{ transactionData?.status }}</h6>
    <h6>Qr Code</h6>
    <v-card class="rounded-pill" color="grey-lighten-4">
      <v-card-text class="ms-3">
        <p class="mb-0">
          <b class="text-secondary" color="grey"
            >Selesaikan Pembayaran Anda Sebelum:</b
          >
        </p>
        <p class="mb-0" id="countdown">
          <b>
            {{ expireDate }}
          </b>
        </p>
      </v-card-text>
    </v-card>
    <v-card class="rounded-xl mt-5" color="blue-accent-4" :elevation="12">
      <v-container>
        <v-row>
          <v-col>
            <v-img :src="imageQris" :width="180" :height="100"></v-img>
          </v-col>
          <v-col>
            <v-img
              :src="imageGpn"
              :width="50"
              class="mt-5 ms-5"
              :height="50"
            ></v-img>
          </v-col>
        </v-row>
        <v-card-text class="text-center text-light">
          <p class="mb-0">
            <b> PT Kreasi Anak Baik </b>
          </p>
          <p class="mb-0">NMID: 12738828192039</p>
        </v-card-text>
        <v-img
          :src="imageQrCode"
          color="white"
          class="mt-5 rounded-xl"
          :elevation="10"
        ></v-img>
      </v-container>
    </v-card>
    <div class="text-center mt-5">
      <v-btn
        @click="sheet = !sheet"
        text="Lihat cara pembayaran"
        class="rounded-xl text-caption"
        color="blue-darken-4"
      ></v-btn>
      <v-bottom-sheet v-model="sheet">
        <v-card class="rounded-xl">
          <v-card-text>
            <div class="text-center">
              <v-icon
                icon="mdi mdi-drag-horizontal-variant"
                @click="sheet = !sheet"
              ></v-icon>
            </div>
            <div class="p-2">
              <h6>Cara Transaksi Menggunakan QR Bayar</h6>
              <ol>
                <li>Pada halaman login atau beranda, pilih QR Bayar</li>
                <li>Scan QRIS yang Anda ingin bayarkan</li>
                <li>
                  Masukan nominal lalu pilih Rekening sumber yang di inginkan,
                  kemudian pilih Lanjutkan
                </li>
                <li>Konfirmasi Transaksi kemudian Lanjut Transfer</li>
                <li>Masukkan Pin Aplikasi</li>
                <li>Pembayaran Berhasil</li>
              </ol>
            </div>
          </v-card-text>
        </v-card>
      </v-bottom-sheet>
    </div>
  </v-container>
</template>
<script setup>
import LogoQris from "../../assets/images/qris.png";
import LogoGpn from "../../assets/images/gpn.png";
import QrCode from "../../assets/images/qrdummy.png";
import CryptoJS from "crypto-js";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useQrStore } from "~/stores/statePayment/useQrCode";
import { useRedirect } from "~/stores/statePayment/useRedirect";
const { $swal } = useNuxtApp();
const qaStore = useQrStore();
const redirectStore = useRedirect();
const transactionData = ref();
const messageExpired = ref();
const expireDate = ref("");
const route = useRoute();
const router = useRouter();
const countdown = ref("");
const expirationDates = ref("")
const waktu = ref("")
const datas = [
  "Masukkan Virtual Account yang Anda ingin bayarkan",
  "Masukan nominal, kemudian pilih Lanjutkan",
  "Konfirmasi Transaksi kemudian Lanjut Transfer",
  "Masukkan Pin Aplikasi",
  "Pembayaran Berhasil",
];
const sheet = ref(false);
const imageQris = LogoQris;
const imageGpn = LogoGpn;
const imageQrCode = QrCode;
let timerId;
let paymentProcessed = false;

onMounted(() => {
  qaStore.getQr();
  getData();
});

redirectStore.setPaymentSuccess(true);

onUnmounted(() => {
  clearTimeout(timerId);
});

const getData = () => {
  try {
    if (paymentProcessed) {
      return;
    }
    const externalId = getValueFromLocalStorage(route.params.idQr[0], 'external_id');
    axios
      .get(
        `http://localhost:3001/payment/INV-TNOS123/${route.params.idQr[0]}/${externalId}/get`
      )
      .then((response) => {
        if (paymentProcessed) {
          return;
        }
        const expiredDate = getValueFromLocalStorage(route.params.idQr[0], 'expired_date');

        const expirationDateUTC = new Date(response.data.expiration_date);

        const options = { timeZone: "Asia/Jakarta" };
        const expirationDateLocal = expirationDateUTC.toLocaleString(
          "id-ID",
          options
        );
        transactionData.value = response.data;
        expireDate.value = expirationDateLocal;

        expirationDates.value = new Date(expiredDate);

        const datess = new Date();

        const sisaWaktu = expirationDates.value - datess;

        const menit = Math.floor(sisaWaktu / (1000 * 60));
        const detik = Math.floor((sisaWaktu % (1000 * 60)) / 1000);

        waktu.value = `${menit} menit - ${detik} detik`;

        countdown.value = waktu.value;

        if (sisaWaktu < 0) {
          removeKeyFromLocalStorage(route.params.idQr[0]);
          router.push("/payment/qrcode");
        }
        if (response.data.status !== "SUCCEEDED") {
          timerId = setTimeout(getData, 1000);
          messageExpired.value = response.data.message;
        } else {
          clearTimeout(timerId);
          paymentProcessed = true;
          clearVirtualAccountData();
          router.push("/redirect_payment");
        }
      });
  } catch (er) {
    console.log(er);
  }
};

const clearVirtualAccountData = () => {
  localStorage.removeItem("qrCodeData");
  localStorage.removeItem("virtualAccountData");
  localStorage.removeItem("ewalletData");
};

const getValueFromLocalStorage = (channelCode, fieldName) => {
  const dataQr =
    JSON.parse(localStorage.getItem("qrCodeData")) || {};
  const encryptedValue = dataQr[channelCode]?.[fieldName];

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

const removeKeyFromLocalStorage = (channelCode) => {
  const dataQr =
    JSON.parse(localStorage.getItem("qrCodeData")) || {};
  
  if (dataQr.hasOwnProperty(channelCode)) {
    delete dataQr[channelCode];
    localStorage.setItem("qrCodeData", JSON.stringify(dataQr));
  }
};
</script>
