<template>
  <div class="full-page-embed">
    <iframe width="100%" height="100%" :src="stagingPayment" />
  </div>
</template>

<style scoped>
.full-page-embed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

<script setup>
import CryptoJS from "crypto-js";
import { onMounted } from "vue";
import axios from "axios";

const stagingPayment = ref("");
const transactionData = ref();
const messageExpired = ref();
const expireDate = ref("");
const route = useRoute();
const router = useRouter();
const countdown = ref("");
const expirationDates = ref("");
const waktu = ref("");

let timerId;
let paymentProcessed = false;

const ewalletValue = (walletCode, fieldName) => {
  const dataEwallet = JSON.parse(localStorage.getItem("ewalletData")) || {};
  const storageValue = dataEwallet[walletCode]?.[fieldName];
  const urlValue =
    dataEwallet[walletCode]?.redirectUrl?.mobile_web_checkout_url;

  if (urlValue) {
    try {
      const value = storageValue.toString();
      const valueUrl = urlValue.toString();
      return { value, valueUrl };
    } catch (e) { }
  }
};

onUnmounted(() => {
  clearTimeout(timerId);
});

const getData = async () => {
  try {
    if (paymentProcessed) {
      return;
    }

    const externalId = ewalletValue(route.params.idPay[0], "external_id");
    const response = await axios.get(
      `http://localhost:3001/payment/INV-TNOS123/${route.params.idPay[0]}/${externalId.value}/get`
    );
    if (paymentProcessed) {
      return;
    }

    const expiredDate = ewalletValue(route.params.idPay[0], "expired_date");

    const expirationDateUTC = new Date(response.data.expiration_date);
    const options = { timeZone: "Asia/Jakarta" };
    const expirationDateLocal = expirationDateUTC.toLocaleString(
      "id-ID",
      options
    );
    transactionData.value = response.data;

    expireDate.value = expirationDateLocal;

    expirationDates.value = new Date(expiredDate.value);

    const datess = new Date();

    const sisaWaktu = expirationDates.value - datess;

    const menit = Math.floor(sisaWaktu / (1000 * 60));
    const detik = Math.floor((sisaWaktu % (1000 * 60)) / 1000);

    waktu.value = `${menit} menit ${detik} detik`;

    countdown.value = waktu.value;

    if (sisaWaktu < 0) {
      removeKeyFromLocalStorage(route.params.idPay[0]);
      router.push("/payment/ewallet");
    }

    if (response.data.status !== "SUCCEEDED") {
      timerId = setTimeout(getData, 1000);
      messageExpired.value = response.data.message;
    } else {
      paymentProcessed = true;
      clearTimeout(timerId);
      clearStorage();
      router.push("/redirect_payment");
    }
  } catch (er) {
    console.log(er);
  }
};

const clearStorage = () => {
  localStorage.removeItem("virtualAccountData");
  localStorage.removeItem("qrCodeData");
  localStorage.removeItem("ewalletData");
};

const getDataUrl = () => {
  const result = ewalletValue(route.params.idPay[0], "redirectUrl");
  if (result) {
    const { value, valueUrl } = result;
    stagingPayment.value = valueUrl;
  } else {
    console.log("error");
  }
};

const removeKeyFromLocalStorage = (walletCode) => {
  const dataQr = JSON.parse(localStorage.getItem("ewalletData")) || {};

  if (dataQr.hasOwnProperty(walletCode)) {
    delete dataQr[walletCode];
    localStorage.setItem("ewalletData", JSON.stringify(dataQr));
  }
};

onMounted(() => {
  getData();
  getDataUrl();
});
</script>
