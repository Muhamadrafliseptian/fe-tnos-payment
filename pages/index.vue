<template>
  <v-row align="center" justify="center">
    <v-col>
      <CardSaldo Title="Halo, Raflii" Saldo="Rp. 200.000" />
    </v-col>
  </v-row>
  <div class="mt-4">
    <h6>Metode Pembayaran</h6>
    <div v-for="data in dataCard">
      <CardPaymentMethod
        :Title="data.title"
        Saldo="lorem ipsum dolor sit amet"
        Color="grey-lighten-4"
        Elevation="3"
        class="mt-5"
        Rounded="rounded-lg"
        :IconKiri="data.icon"
        @click="postClick(data.id)"
      />
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      dataCard: {
        cardSatu: {
          id: 'virtualaccount',
          title: 'Virtual Account',
          icon: 'mdi mdi-bank-circle-outline',
        },
        cardDua: {
          id: 'qrcode',
          title: 'QRIS',
          icon: 'mdi mdi-qrcode',
        },
        cardTiga: {
          id: 'ewallet',
          title: 'E-Wallet',
          icon: 'mdi mdi-wallet',
        },
      }
    }
  },
  methods: {
    postClick(id) {
      this.$router.push(`/payment/${id}`)
    }
  }
}
</script>
