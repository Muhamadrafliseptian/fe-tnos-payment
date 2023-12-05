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
import axios from "axios";
export default {
  data() {
    return {
      lastQrCreationTime: 0, 
      dataCard: {
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
    };
  },
  methods: {
    postClick(id) {
      this.$router.push(`/payment/${id}`);
    },
    createPaymentQr() {
      const lastQrCreationTime =
        parseInt(localStorage.getItem("lastQrCreationTime")) || 0;
      const currentTime = Date.now();

      if (currentTime - lastQrCreationTime >= 5 * 60 * 1000) {
        axios
          .post("https://2037-2001-448a-2082-4433-cd47-1301-6e3e-3bab.ngrok-free.app/payment/qrcode", {})
          .then((response) => {
            this.$router.push("/payment/qrcode");
            console.log(response);

            localStorage.setItem("lastQrCreationTime", currentTime.toString());
          })
          .catch((error) => {
            console.error("Error creating QR code:", error);
          });
      } else {
        alert(
          "Please wait for 5 minutes before creating another QR code."
        );
      }
    },
  },
};
</script>
