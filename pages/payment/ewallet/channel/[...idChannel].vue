<template>
  <v-container class="pt-5">
    <p class="text-caption">
      <b> Masukkan nomor yang terdaftar di {{ idFromParams }} </b>
    </p>
    <v-responsive
      class="mt-5 mx-auto mb-5"
      max-width="344"
      color="grey-lighten-5"
    >
      <v-text-field
        clearable
        hide-details="auto"
        :label="'Nomor ' + this.idFromParams"
        v-model="mobile_number"
      ></v-text-field>
    </v-responsive>
    <ol>
      <li v-for="data in items" class="text-caption mb-3">
        {{ data.text }}
      </li>
    </ol>
    <v-btn
      @click="handlePay"
      color="indigo"
      text="lanjutkan"
      width="500"
      class="rounded-pill"
      style="margin-top: 250px"
    ></v-btn>
  </v-container>
</template>
<script>
import CryptoJS from "crypto-js";

import axios from "axios";
export default {
  data: () => ({
    items: [
      {
        text: "Buka aplikasi DANA dan cek notifikasi untuk menyelesaikan pembayaran",
      },
      {
        text: "Pastikan anda melakukan pembayaran dalam waktu 30 menit untuk menghindari pembatalan otomatis",
      },
    ],
    mobile_number: "+6281411126356",
    secretKey: "secret-key",
  }),
  computed: {
    idFromParams() {
      return this.$route.params.idChannel[0];
    }
  },
  methods: {
    async handlePay() {
      try {
        axios
          .post("http://127.0.0.1:3001/payment/ewallet", {
            channel_code: this.idFromParams,
            mobile_number: this.mobile_number,
          })
          .then((response) => {
            if (response.data.status == "PENDING") {
              localStorage.setItem(
                "redirectUrl",
                CryptoJS.AES.encrypt(
                  response.data.actions.desktop_web_checkout_url,
                  this.secretKey
                ).toString()
              );
              localStorage.setItem("chargeAmount", response.data.charge_amount);

              console.log("berhasil buat payment ewallet");
              this.$router.push(`/payment/ewallet/pay/${this.idFromParams}`);
            } else {
              console.log("error creating charge ewallet");
            }
          });
      } catch (er) {
        console.log(er);
      }
    },
  },
};
</script>
