<template>
  <v-container>
    <v-btn @click="createPaymentQr"> bayar </v-btn>
    <h6>Qr Code</h6>
    <v-card class="rounded-pill" color="grey-lighten-4">
      <v-card-text class="ms-3">
        <p class="mb-0">
          <b class="text-secondary" color="grey">Finish Before</b>
        </p>
        <p class="mb-0">
          <b>12, Desember 2023, (20:51)</b>
        </p>
      </v-card-text>
    </v-card>
    <v-card class="rounded-xl mt-5" color="blue-accent-4" :elevation="12">
      <v-container>
        <v-row>
          <v-col>
            <v-img :src="logoQris" :width="180" :height="100"></v-img>
          </v-col>
          <v-col>
            <v-img
              :src="logoGpn"
              :width="50"
              class="mt-5 ms-5"
              :height="50"
            ></v-img>
          </v-col>
        </v-row>
        <v-card-text class="text-center text-light">
          <p class="mb-0">
            <b> PT Kreasi Anak Baik </b>
          </p>
          <p class="mb-0">NMID: 12738828192039</p>
        </v-card-text>
        <v-img :src="qrCode" class="mt-5 rounded-xl" :elevation="10"></v-img>
      </v-container>
    </v-card>
    <div class="text-center mt-5">
      <v-bottom-sheet>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            text="Lihat cara pembayaran"
            class="rounded-xl text-caption"
            color="grey-lighten-3"
          ></v-btn>
        </template>
        <v-card class="rounded-xl" title="Cara Transaksi Menggunakan QR Bayar">
          <div class="p-2">
            <ol>
              <li>Pada halaman login atau beranda, pilih QR Bayar</li>
              <li>Scan QRIS yang Anda ingin bayarkan</li>
              <li>
                Masukan nominal lalu pilih Rekening sumber yang di inginkan,
                kemudian pilih Lanjutkan
              </li>
              <li>Konfirmasi Transaksi kemudian Lanjut Transfer</li>
              <li>Masukkan Pin Aplikasi</li>
              <li>Pembayaran Berhasil</li>
            </ol>
          </div>
        </v-card>
      </v-bottom-sheet>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import LogoQris from "../../assets/images/qris.png";
import LogoGpn from "../../assets/images/gpn.png";
import QrCode from "../../assets/images/qrdummy.png";

export default {
  data() {
    return {
      lastQrCreationTime: 0,
      logoQris: LogoQris,
      logoGpN: LogoGpn,
      qrCode: QrCode,
    };
  },
  methods: {
    createPaymentQr() {
      const lastQrCreationTime =
        parseInt(localStorage.getItem("lastQrCreationTime")) || 0;
      const currentTime = Date.now();

      if (currentTime - lastQrCreationTime >= 5 * 60 * 1000) {
        axios
          .post("http://127.0.0.1:3001/payment/qrcode", {})
          .then((response) => {
            this.$router.push("/payment/qrcode");
            console.log(response);

            localStorage.setItem("lastQrCreationTime", currentTime.toString());
          })
          .catch((error) => {
            console.error("Error creating QR code:", error);
          });
      } else {
        alert("Please wait for 5 minutes before creating another QR code.");
      }
    },
  },
};
</script>
