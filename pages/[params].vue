<template>
    <div class="mt-4">
      <h6>Metode Pembayaran</h6>
      <div v-for="datas in data[0]">
        <CardPaymentMethod :Title="datas.title" Saldo="lorem ipsum dolor sit amet" Color="grey-lighten-4" Elevation="3"
          class="mt-5" Rounded="rounded-lg" :IconKiri="datas.icon" @click="postClick(datas.id, urlParams)" />
      </div>
    </div>
  </template>
  <script setup>
  
  const router = useRouter();

  const urlParams = router.currentRoute.value.fullPath.split('/').slice(1).join('/')

  const data = [
    {
      cardSatu: {
        id: "virtualaccount",
        title: "Virtual Account",
        icon: "mdi mdi-bank-circle-outline"
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
      cardEmpat: {
        id: "qrisbca",
        title: "QRIS-BCA",
        icon: "mdi mdi-wallet",
      }
    },
  ];
  
  const postClick = (id, urlParams) => {
    router.push(`/payment/${id}/${urlParams}`);
  };
  </script>
  