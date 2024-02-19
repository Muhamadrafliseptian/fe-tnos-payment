<template>
    <!-- <v-row align="center" justify="center">
      <v-col>
        <CardSaldo Title="ID Pemesanan INV-123" Saldo="Rp. 200.000" />
      </v-col>
    </v-row> -->
    <div class="mt-4">
      <p>
        {{ 
            $route.params.paymentParams[0]
         }}
    </p>
    <p>
        {{ 
            $route.params.paymentParams[1]
         }}
    </p>
      <h6>Metode Pembayaran</h6>
      <div v-for="datas in data[0]">
        <CardPaymentMethod :Title="datas.title" Saldo="lorem ipsum dolor sit amet" Color="grey-lighten-4" Elevation="3"
          class="mt-5" Rounded="rounded-lg" :IconKiri="datas.icon" @click="postClick(datas.id)" />
      </div>
    </div>
  </template>
  <script setup>
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
  </script>
  