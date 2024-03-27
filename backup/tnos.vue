<template>
    <div class="mt-4">
        <h6>Metode Pembayaran</h6>
        <div v-for="datas in data[0]" :key="datas.id">
            <CardPaymentMethod :Title="datas.title" Saldo="lorem ipsum dolor sit amet" Color="grey-lighten-4" Elevation="3"
                class="mt-5" Rounded="rounded-lg" :IconKiri="datas.icon" @click="postClick(datas.id)" />
        </div>
        <p>
            {{ dataParams }}
        </p>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import decryptDataParams from "./utils/decryptParams";
import CryptoJs from 'crypto-js'

const router = useRouter();
const route = useRoute();
let idInvoice = ref("");
const data = [
    {
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
];

const postClick = (id) => {
    router.push(`/payment/${id}`);
};


// localhost:8000/aaaaaaaaaaaaaaaaaaaaaa|bbbbbbbbbbbbbbbbbb

// split

// fungsi split() {
//     splitInvoice = aaaaaaaaaaaaaaaaaaaaaa
//     splitAmount = bbbbbbbbbbbbbbbbbb
// }

// this.router.push('localhost:8000/payment/virtualaccount/${splitInvoice}/${spiltAmount}')

// const dataParams = route.params.paymentParams[0];

// const paramsDecrypt = () => {
//     const key = "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="
//     const test = CryptoJs.AES.decrypt(
//         dataParams,
//         key
//     ).toString(CryptoJs.enc.Utf8)

//     console.log('==============ini hasilnya======================');
//     console.log(test);
//     console.log('====================================');
// };

// paramsDecrypt();
</script>
