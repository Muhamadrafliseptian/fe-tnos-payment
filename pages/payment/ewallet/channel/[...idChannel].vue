<template>
  <v-container class="pt-5">
    <p class="text-caption">
      <b> Masukkan nomor yang terdaftar di {{ idFromParams }} </b>
    </p>
    <v-text-field clearable hide-details="auto" :label="'Nomor ' + idFromParams" v-model="mobileNumber"></v-text-field>
    <div class="mt-5">
      <ol>
        <li v-for="data in items" class="text-caption mb-3">
          {{ data }}
        </li>
      </ol>
    </div>
    <div class="text-center">
      <v-btn @click="createWallet" color="indigo" :text="'lanjutkan buka aplikasi ' + idFromParams"
        class="rounded-pill mt-5"></v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { useEwalletStore } from "~/stores/statePayment/useEwallet";
const walletStore = useEwalletStore();
const route = useRoute();
const router = useRouter();
const idFromParams = route.params.idChannel[0];
const secretKey = "ajajdakdja3ijdaidahbc";
const mobileNumber = ref("+6281411126356");
const items = [
  "Buka aplikasi DANA dan cek notifikasi untuk menyelesaikan pembayaran",
  "Pastikan anda melakukan pembayaran dalam waktu 30 menit untuk menghindari pembatalan otomatis",
];

const createWallet = async () => {
  const result = await walletStore.createWallet(idFromParams, mobileNumber.value);
  if (result) {
    router.push(`/payment/ewallet/pay/${idFromParams}`);
  } else {
    router.push(`/payment/ewallet/pay/${idFromParams}`);
  }
};
</script>
