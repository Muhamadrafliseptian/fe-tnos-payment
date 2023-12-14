<template>
  <v-row align="center" justify="center">
    <v-col>
      <CardSaldo Title="ID Pemesanan INV-123" Saldo="Rp. 200.000" />
    </v-col>
  </v-row>
  <div class="mt-4">
    <h6>Metode Pembayaran</h6>
    <div v-for="datas in data[0]">
      <CardPaymentMethod
        :Title="datas.title"
        Saldo="lorem ipsum dolor sit amet"
        Color="grey-lighten-4"
        Elevation="3"
        class="mt-5"
        Rounded="rounded-lg"
        :IconKiri="datas.icon"
        @click="postClick(datas.id)"
      />
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import axios from "axios";
const router = useRouter();

const data = [
  {
    cardSatu: {
      id: "virtualaccount",
      title: "Virtual Account",
      icon: "mdi mdi-bank-circle-outline",
    },
    cardDua: {
      id: "qrcode",
      title: "QRIS",
      icon: "mdi mdi-qrcode",
    },
    cardTiga: {
      id: "ewallet",
      title: "E-Wallet",
      icon: "mdi mdi-wallet",
    },
  },
];

const postClick = (id) => {
  router.push(`/payment/${id}`);
};
let paidFound = false;

const getData = () => {
  try {
    axios
      .get("http://127.0.0.1:3001/payment/INV-TNOS123/get")
      .then((response) => {
        const paymentData = response.data && response.data.data;
        if (paymentData) {
          paymentData.forEach((payment) => {
            if (payment.status === "PAID") {
              paidFound = true;
              console.log(payment);
            }
          });

          const pendingPayments = paymentData.filter(
            (payment) => payment.status !== "PAID"
          );
          console.log(pendingPayments);
          if (pendingPayments.length > 0 && paidFound) {
            setTimeout(getData, 5000);
          }
        }
      });
  } catch (er) {
    console.error(er);
  }
};

getData();
</script>
