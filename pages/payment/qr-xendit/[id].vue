<template>
    MAkanana
</template>

<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";
import { useQrStore } from "~/stores/statePayment/useQrCode";
import { useRedirect } from "~/stores/statePayment/useRedirect";

const transactionData = ref();
const expireDate = ref("");
const countdown = ref("");
const expirationDates = ref("");

const qaStore = useQrStore();

let timerId;
let paymentProcessed = false;

onMounted(() => {
    qaStore.getQr();
    getData();
});

const getData = () => {
    console.log(route.params.id);
    try {
        axios
            .get(
                'http://localhost:3001/payment/INV-TNOS123/ID_DANA/tnos-xq64i/get'
            ).then((response) => {
                if (paymentProcessed) {
                    return;
                }

                const expiredDate = getValueFromLocalStorage(
                    "ID_DANA",
                    "expired_date"
                );

                const expirationDateUTC = new Date(response.data.expiration_date);

                const options = { timeZone: "Asia/Jakarta" };
                const expirationDateLocal = expirationDateUTC.toLocaleString(
                    "id-ID",
                    options
                );

                console.log("Pembayaran");
                console.log(expiredDate);
                transactionData.value = response.data;
                expireDate.value = expirationDateLocal;

                expirationDates.value = new Date(expiredDate);

                const datess = new Date();

                const sisaWaktu = expirationDates.value - datess;

                const menit = Math.floor(sisaWaktu / (1000 * 60));
                const detik = Math.floor((sisaWaktu % (1000 * 60)) / 1000);

                waktu.value = `${menit} menit - ${detik} detik`;

                countdown.value = waktu.value;

                console.log(sisaWaktu);

            }).catch((error) => {
                console.log(error);
            })
    } catch (error) {
        console.log(error);
    }
}

const getValueFromLocalStorage = (channelCode, fieldName) => {
    const dataQr = JSON.parse(localStorage.getItem("qr-xendit")) || {};

    console.log("Data QR Ada");
    console.log(dataQr[channelCode]?.[fieldName]);
    const encryptedValue = dataQr?.channelCode

    if (encryptedValue) {
        try {
            const decryptedValue = CryptoJS.AES.decrypt(
                encryptedValue,
                "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
            ).toString(CryptoJS.enc.Utf8);

            console.log("Makananan");
            return decryptedValue;
        } catch (error) {
            console.error(`Error decrypting ${fieldName}:`, error.message || error);
            return null;
        }
    }

    return null;
};

const removeKeyFromLocalStorage = (channelCode) => {
    const dataQr = JSON.parse(localStorage.getItem("qr-xendit")) || {};

    if (dataQr.hasOwnProperty(channelCode)) {
        delete dataQr[channelCode];
        localStorage.setItem("qr-xendit", JSON.stringify(dataQr));
    }
};

</script>