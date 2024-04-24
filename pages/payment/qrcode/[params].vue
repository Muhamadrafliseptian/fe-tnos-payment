<template>
  <div>
    <div class="d-flex">
      <div class="me-3">
        <b>
          <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.push('/payment')"
            color="black"></v-icon>
        </b>
      </div>
      <h6 class="mb-5">Bayar Dengan QRIS</h6>
    </div>
    <div>
      <CardBank Subtitle="lorem ipsum dolor sit amet" Title="BCA" class="mb-3" @click="generateQris()">
        <template #avatarImage>
          <v-avatar size="100" class="ms-4" rounded="0">
            <v-img :src="logoBank"></v-img>
          </v-avatar>
        </template>
      </CardBank>
    </div>
    <v-dialog v-model="loading" persistent content-class="modal">
      <div class="text-center">
        <v-progress-circular :size="70" :width="7" color="#1867C0" indeterminate></v-progress-circular>
      </div>
    </v-dialog>
  </div>
</template>

<script setup>
import logoBank from '@/assets/images/bca.png'
import { ref, onMounted } from "vue";
import { useQrStore } from "~/stores/statePayment/useQrCode";
import { useRouter } from "vue-router";
import CryptoJS from 'crypto-js'
import axios from 'axios';
// const qaStore = useQrStore();
const { $swal } = useNuxtApp();
const router = useRouter();
const timestamp = ref("")
const accessToken = ref("")
const symmetricSignature = ref("")
const body = ref("")
const amount = ref("")
const externalId = ref("")
const loading = ref(false);

onMounted(() => {
  // qaStore.initialize();
  const qr = JSON.parse(localStorage.getItem("qr"));
  if (qr) {
    timestamp.value = qr.encrypttimestamp;
    accessToken.value = qr.token;
    body.value = qr.body;
    symmetricSignature.value = qr.encryptedSymmetric;
    decryptDatas();
  }
});
const decryptDatas = () => {
  const key = "yefaifbbceyyaya2-29491031jdanaannaeu2";
  const decryptData = {
    decryptBody: JSON.parse(CryptoJS.AES.decrypt(body.value, key).toString(CryptoJS.enc.Utf8)),
    decryptSignature: CryptoJS.AES.decrypt(symmetricSignature.value, key).toString(CryptoJS.enc.Utf8),
    decryptTime: CryptoJS.AES.decrypt(timestamp.value, key).toString(CryptoJS.enc.Utf8),
    decryptToken: CryptoJS.AES.decrypt(accessToken.value, key).toString(CryptoJS.enc.Utf8)
  };

  timestamp.value = decryptData.decryptTime;
  accessToken.value = decryptData.decryptToken;
  symmetricSignature.value = decryptData.decryptSignature;
  body.value = decryptData.decryptBody;
  const amountValue = body.value.amount.value;
  const partnerReferenceNo = body.value.partnerReferenceNo
  amount.value = amountValue
  externalId.value = partnerReferenceNo
}

const generateQris = () => {
  loading.value = true;
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
      'X-Timestamp': `${timestamp.value}`,
      'X-Signature': `${symmetricSignature.value}`,
      'X-External-ID': `${externalId.value}`,
    }
  };
  if (!localStorage.getItem("qrcodeData")) {
    const body = {
      value: amount.value,
      partnerReferenceNo: externalId.value,
    };

    axios.post('http://localhost:3001/payment/bca/qris', body, config).then((response) => {
      console.log(response);
      let responseStatus = response.data.responseBcaQris.responseCode
      if (responseStatus === "2004700") {
        loading.value = false;
        localStorage.setItem("qrcodeData", JSON.stringify(response.data));
        router.push('/payment/qrcode/view/success');
      } else {
        loading.value = false
        $swal.fire({
          title: "Galat",
          text: response.data.responseBcaQris.responseMessage,
          icon: "error",
          showConfirmButton: true
        }).then(()=> {
          router.push('/')
          localStorage.removeItem("qr")
        })
      }
    }).catch((err) => {
      loading.value = false;
      console.log(err);
    });
  } else {
    console.log("Data qrcodeData sudah ada di local storage");
    router.push('/payment/qrcode/view/success');
    loading.value = false;
  }
};
</script>
<style>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>