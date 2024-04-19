<template>
  <v-container class="pt-5">
    <div v-if="idFromParams === 'ID_JENIUSPAY'">
      <v-text-field clearable hide-details="auto" label="Cashtag" v-model="cashTag"></v-text-field>
      <br>
      <v-text-field clearable hide-details="auto" :label="'Nomor ' + idFromParams" v-model="mobileNumber"></v-text-field>
    </div>
    <div v-else-if="idFromParams === 'ID_OVO'">
      <v-text-field clearable hide-details="auto" :label="'Nomor ' + idFromParams" v-model="mobileNumber"></v-text-field>
    </div>
    <div class="mt-5">
      <ol>
        <li v-for="data in items" class="text-caption mb-3">
          {{ data }}
        </li>
      </ol>
    </div>
    <div class="text-center">
      <v-btn @click="createWallet" color="indigo" :text="'lanjutkan buka aplikasi ' + idFromParams"
        class="rounded-pill mt-5 text-caption"></v-btn>
    </div>
  </v-container>
</template>
  
<script setup>
import { useEwalletStore } from "~/stores/statePayment/useEwallet";
import CryptoJS from "crypto-js"

const walletStore = useEwalletStore();
const route = useRoute();
const router = useRouter();
const idFromParams = route.params.id;
const secretKey = "ajajdakdja3ijdaidahbc";
const mobileNumber = ref("+6281411126356");
const cashTag = ref("$test")
const items = [
  "Buka aplikasi dan cek notifikasi untuk menyelesaikan pembayaran",
  "Pastikan anda melakukan pembayaran dalam waktu 30 menit untuk menghindari pembatalan otomatis",
];

const urlParams = router.currentRoute.value.fullPath.split("/").slice(3).join("/")
const splitAmount = urlParams.split('|')[1]
const convert = splitAmount.split("/")[0];
const encryptAmount = CryptoJS.AES.decrypt(atob(convert), 'U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=').toString(CryptoJS.enc.Utf8);

const urlNew = urlParams.split("/")[0];

const createWallet = async () => {
  let result = false;

  if (idFromParams === "ID_JENIUSPAY") {
    result = await walletStore.createWallet(idFromParams, mobileNumber.value, cashTag.value);
  } else if (idFromParams === "ID_OVO") {
    result = await walletStore.createWallet(idFromParams, mobileNumber.value, "");
  } else {
    result = await walletStore.createWallet(idFromParams);
  }

  if (result) {
    router.push(`${urlNew}`);
  } else {
    router.push(`pay/${idFromParams}`);
  }
};
</script>
  