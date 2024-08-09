<template>
  <div class="mt-4">
    <h6>Metode Pembayaran</h6>
    <CardPaymentMethod v-for="card in data" :key="card.id" :Title="card.title" :Saldo="card.saldo"
      Color="grey-lighten-4" Elevation="3" class="mt-5" Rounded="rounded-lg" :IconKiri="card.icon"
      @click="handleCardClick(card.id)" />
    <v-dialog v-model="loading" persistent content-class="modal">
      <div class="text-center">
        <v-progress-circular :size="70" :width="7" color="#1867C0" indeterminate></v-progress-circular>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { ref } from 'vue';

const router = useRouter();
const config = useRuntimeConfig();
const loading = ref(false);
// const fullParams = router.currentRoute.value.fullPath;
// const urlParams = router.currentRoute.value.fullPath.split('/').slice(1).join('/')
// const splitAmount = urlParams.split('|')[1]
// const encryptAmount = CryptoJS.AES.decrypt(atob(splitAmount), "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=").toString(CryptoJS.enc.Utf8)

const data = [
  {
    id: "virtualaccount",
    title: "Virtual Account",
    icon: "mdi mdi-bank-circle-outline",
    saldo: "lorem ipsum dolor sit amet"
  },
  // {
  //   id: "qrcode",
  //   title: "QRIS BCA",
  //   icon: "mdi mdi-qrcode",
  //   saldo: "lorem ipsum dolor sit amet"
  // },
  {
    "id": "qr-xendit",
    "title": "QRIS",
    "icon": "mdi mdi-qrcode",
    "saldo": "lorem ipsum dolor sit amet"
  },
  {
    id: "ewallet",
    title: "E-Wallet",
    icon: "mdi mdi-wallet",
    saldo: "lorem ipsum dolor sit amet"
  },
  {
    id: "paypal",
    title: "Paypal",
    icon: "mdi mdi-book",
    saldo: "lorem ipsum dolor sit amet"
  }
];

const handleCardClick = (id) => {
  
  if (id === "qrcode") {
    postClick(fullParams, encryptAmount);

  } else if (id === "qr-xendit") {

    postXenditQr(10000, 200000)
    // postXenditQr(fullParams, encryptAmount);

  } else {
    router.push(`/payment/${id}`);
  }
}

const postXenditQr = (amount, reference) => {

  loading.value = true

  if (!localStorage.getItem("qr-xendit")) {
    axios.post(`http://127.0.0.1:3001/xendit/qr-xendit`).then((response) => {
      loading.value = false

      router.push('/payment/qr-xendit-test/10000|200000/ID_DANA')
      localStorage.setItem("qr-xendit", JSON.stringify(response.data));
    })
  }

}

// const postXenditQr = (fullParams, amount) => {

//   console.log(amount);
  // loading.value = true;

  // if (!localStorage.getItem("qr-xendit")) {
  //   axios.post(`${config.public.apiBase}/payment/qrcode`, {
  //     amount
  //   }).then((response) => {
  //     loading.value = false;

  //     router.push(`/payment/qr-xendit/${urlParams}/ID_DANA`);
  //     localStorage.setItem("qr-xendit", JSON.stringify(response.data));
  //   }).catch((error) => {
  //     console.log(error);
  //   })
  // } else {
  //   loading.value = false;

  //   router.push(`/payment/qr-xendit/${urlParams}/ID_DANA`);
  // }
// }

const postClick = (fullParams, amountPrice) => {
  loading.value = true;

  if (!localStorage.getItem("qr")) {
    const amount = (amountPrice * 1).toFixed(2).toString()
    axios.post(`${config.public.apiBase}/payment/bca/generate/qris_symmetric_signature`, {
      amount
    }).then((response) => {
      loading.value = false;
      router.push(`/payment/qrcode${fullParams}`);
      localStorage.setItem("qr", JSON.stringify(response.data));
    })
      .catch((error) => {
        console.error('Error:', error);
        loading.value = false;
      });
  } else {
    loading.value = false;
    router.push(`/payment/qrcode${fullParams}`);
  }
}
</script>

<style>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
