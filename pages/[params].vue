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
import axios from 'axios';
import { ref } from 'vue';

const router = useRouter();
const loading = ref(false);
const urlParams = router.currentRoute.value.fullPath.split('/').slice(1).join('/')

const data = [
  {
    id: "virtualaccount",
    title: "Virtual Account",
    icon: "mdi mdi-bank-circle-outline",
    saldo: "lorem ipsum dolor sit amet"
  },
  {
    id: "qrcode",
    title: "QRIS",
    icon: "mdi mdi-qrcode",
    saldo: "lorem ipsum dolor sit amet"
  },
  {
    id: "ewallet",
    title: "E-Wallet",
    icon: "mdi mdi-wallet",
    saldo: "lorem ipsum dolor sit amet"
  }
];

const handleCardClick = (id) => {
  if (id === "qrcode") {
    postClick();
  } else {
    router.push(`/payment/${id}/amount`);
  }
}

const postClick = () => {
  loading.value = true;
  if (!localStorage.getItem("qr")) {
    const amount = "1.00";
    axios.post('http://localhost:3001/payment/bca/generate/qris_symmetric_signature', {
      amount
    }).then((response) => {
      loading.value = false;
      router.push(`/payment/qrcode`);
      localStorage.setItem("qr", JSON.stringify(response.data));
    })
      .catch((error) => {
        console.error('Error:', error);
        loading.value = false;
      });
  } else {
    loading.value = false;
    router.push(`/payment/qrcode`);
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
