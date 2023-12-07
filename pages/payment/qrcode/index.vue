<template>
  <v-container>
    <h6>Status Pembayaran: {{ qrData.status }}</h6>
    <v-btn @click="createPaymentQr" hidden> bayar </v-btn>
    <h6>Qr Code</h6>
    <v-card class="rounded-pill" color="grey-lighten-4">
      <v-card-text class="ms-3">
        <p class="mb-0">
          <b class="text-secondary" color="grey"
            >Selesaikan Pembayaran Anda Sebelum:</b
          >
        </p>
        <p class="mb-0" id="countdown">
          <b>
            {{ qrData.expiration_date_local }}
          </b>
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
              :src="logoGpN"
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
      <v-btn
        @click="sheet = !sheet"
        text="Lihat cara pembayaran"
        class="rounded-xl text-caption"
        color="blue-darken-4"
      ></v-btn>
      <v-bottom-sheet v-model="sheet">
        <v-card class="rounded-xl">
          <v-card-text>
            <div class="text-center">
              <v-icon
                icon="mdi mdi-drag-horizontal-variant"
                @click="sheet = !sheet"
              ></v-icon>
            </div>
            <div class="p-2">
              <h6>Cara Transaksi Menggunakan QR Bayar</h6>
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
          </v-card-text>
        </v-card>
      </v-bottom-sheet>
    </div>
  </v-container>
</template>

<script>
import CryptoJS from "crypto-js";
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
      expiresAt: null,
      countdown: null,
      sheet: false,
      secretKey: "secret-key",
      qrData: "",
    };
  },
  computed: {
    countdownDisplay() {
      if (!this.expiresAt) return "";
      const now = new Date();
      const expirationDate = new Date(this.expiresAt);
      const timeDifference = expirationDate - now;

      if (timeDifference <= 0) {
        clearInterval(this.countdown);
        return "Countdown expired";
      }
      const seconds = Math.floor(timeDifference / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${minutes} menit ${remainingSeconds} detik lagi`;
    },
  },
  methods: {
    startCountdown() {
      this.countdown = setInterval(() => {
        this.countdown = this.countdown - 1;
      }, 1000);
    },
    createPaymentQr() {
      const currentTime = Date.now();
      if (this.countdown > 0) {
        alert("Please wait for the current countdown to finish.");
        return;
      }
      axios
        .post("http://127.0.0.1:3001/payment/qrcode", {})
        .then((response) => {
          this.$router.push("/payment/qrcode");
          this.expiresAt = response.data.expires_at;
          localStorage.setItem(
            "expiresAt",
            CryptoJS.AES.encrypt(this.expiresAt, this.secretKey).toString()
          );
          localStorage.setItem(
            "lastQrCreationTime",
            CryptoJS.AES.encrypt(
              currentTime.toString(),
              this.secretKey
            ).toString()
          );
          this.startCountdown();
        })
        .catch((error) => {
          console.error("Error creating QR code:", error);
        });
    },
    async getStatusLog() {
      try {
        const response = await axios.get(
          "http://localhost:3001/payment/tnos-dbsqgc/get"
        );
        const expirationDateUTC = new Date(response.data.expiration_date);

        const options = { timeZone: "Asia/Jakarta" };
        const expirationDateLocal = expirationDateUTC.toLocaleString(
          "id-ID",
          options
        );

        this.qrData = {
          ...response.data,
          expiration_date_local: expirationDateLocal,
        };

        if(response.data.status !== 'PAID'){
          setTimeout(this.getStatusLog, 500000);
        }

      } catch (error) {
        console.error("Error:", error);
        setTimeout(this.getStatusLog, 5000);
      }
    },
  },
  created() {
    this.getStatusLog();
    if (process.client) {
      const encryptedExpiresAt = localStorage.getItem("expiresAt");
      if (encryptedExpiresAt) {
        this.expiresAt = CryptoJS.AES.decrypt(
          encryptedExpiresAt,
          this.secretKey
        ).toString(CryptoJS.enc.Utf8);
        this.startCountdown();
      }
      const encryptedLastQrCreationTime =
        localStorage.getItem("lastQrCreationTime");
      if (encryptedLastQrCreationTime) {
        const decryptedLastQrCreationTime = CryptoJS.AES.decrypt(
          encryptedLastQrCreationTime,
          this.secretKey
        ).toString(CryptoJS.enc.Utf8);
        this.lastQrCreationTime = parseInt(decryptedLastQrCreationTime) || 0;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.countdown);
  },
};
</script>
