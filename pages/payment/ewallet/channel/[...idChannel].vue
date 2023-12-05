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
  }),
  computed: {
    idFromParams() {
      return this.$route.params.idChannel[0];
    },
  },
  methods: {
    handlePay() {
      axios
        .post("http://127.0.0.1:3001/payment/ewallet", {})
        .then((response) => {
          console.log(response);
        });
    },
  },
};
</script>
