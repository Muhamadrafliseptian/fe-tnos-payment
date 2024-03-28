<template>
  <v-container fluid>
    <div class="d-flex">
      <div class="me-3">
        <b>
          <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.go(-1)" color="black"></v-icon>
        </b>
      </div>
      <h6 class="mb-5">Bayar Dengan QRIS</h6>
    </div>
    <p class="fontsize text-end">
      Sisa waktu pembayaran: {{ timeRemainings }}
    </p>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="qr-card" elevation="3">
          <v-img :src="qrImage" alt="QR Code Image" class="qr-image" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const qrMerchant = ref("");
const qrImage = ref("");
const expiredDate = ref("")
const router = useRouter()
const timeRemainings = ref("")
let timerId;

onMounted(() => {
  const qrcode = JSON.parse(localStorage.getItem("qrcodeData"));
  if (qrcode) {
    qrMerchant.value = qrcode.responseBcaQris.merchantName;
    qrImage.value = qrcode.responseBcaQris.qrImage;
    const timeExpire = qrcode.expiration_date
    expiredDate.value = timeExpire
    toBase64();
  } else {
    router.push('/payment')
  }
  countWaiting()
});

const toBase64 = () => {
  qrImage.value = `data:image/png;base64, ${qrImage.value}`;
};
const countWaiting = () => {
  const expiringDate = new Date(expiredDate.value)
  const datess = new Date();
  const timeRemaining = expiringDate - datess
  const menit = Math.floor(timeRemaining / (1000 * 60));
  const detik = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  if(timeRemaining < 0){
    localStorage.removeItem("qr")
    localStorage.removeItem("qrcodeData")
    router.push('/payment')
  }
  timeRemainings.value = `${menit} menit ${detik} detik`
  timerId = setTimeout(countWaiting, 1000);
}
</script>

<style scoped>
.qr-card {
  max-width: 400px;
  margin: 0 auto;
}

.qr-image {
  width: 100%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
.fontsize{
  font-size: 12px
}
</style>