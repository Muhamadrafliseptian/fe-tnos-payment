<template>
    Page New
</template>

<script setup>
import axios from 'axios';
import { useQrStore } from "~/stores/statePayment/useQrCodeXendit";
import { useRedirect } from "~/stores/statePayment/useRedirect";

const redirectStore = useRedirect();
const qaStore = useQrStore();
const expireDate = ref("");
let timerId;
let paymentProcessed = false;

onMounted(() => {
    getData()
})

redirectStore.setPaymentSuccess(true);

onUnmounted(() => {
    clearTimeout(timerId);
});


const getData = async () => {
    try {

        if (paymentProcessed) {
            return;
        }

        const dataQr = JSON.parse(localStorage.getItem("qr-xendit")) || {};

        if (this.$socket) {
            this.$socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            this.$socket.on('messageToClient', (payload) => {
                this.message = payload;
                console.log('Message from server:', payload);
            });
        } else {
            console.error('Socket not initialized');
        }
        // await axios.get(`http://localhost:3001/xendit/${dataQr.channel_code}/${dataQr.id}/get`)
        //     .then((response) => {

        //         if (paymentProcessed) {
        //             return;
        //         }

        //         const expirationDateUTC = new Date(response.data.expires_at);
        //         const options = {
        //             timeZone: "Asia/Jakarta",
        //             year: 'numeric',
        //             month: 'long',
        //             day: 'numeric',
        //             hour: 'numeric',
        //             minute: 'numeric',
        //             second: 'numeric'
        //         };

        //         const expirationDateLocal = expirationDateUTC.toLocaleString("id-ID", options);

        //         const datess = new Date();

        //         console.log("56");
        //         const expirationDateNow = datess.toLocaleString("id-ID", options);

        //         console.log("Tanggal Sekarang : " + expirationDateNow);
        //         console.log("Expire : " + expirationDateLocal);

        //         // Menghitung selisih waktu
        //         const now = new Date();
        //         const difference = expirationDateUTC - now; // Selisih dalam milidetik

        //         // Mengonversi milidetik ke hari, jam, menit, dan detik
        //         const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        //         const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        //         const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        //         const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        //         console.log(`Selisih waktu: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`);


        //     }).catch((error) => {
        //         console.log(error);
        //     })

    } catch (error) {
        console.log(error);
    }
}

const getValueFromLocalStorage = (channelCode, fieldName) => {
    const dataQr = JSON.parse(localStorage.getItem("qr-xendit")) || {};

    if (encryptedValue) {
        try {

            return encryptedValue;
        } catch (error) {
            console.error(`Error decrypting ${fieldName}:`, error.message || error);
            return null;
        }
    }

    return null;
};
</script>