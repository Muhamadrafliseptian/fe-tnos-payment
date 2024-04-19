<template>
    <button @click="getData(encryptAmount)" style="background-color: green; padding: 10px 30px; border-radius: 20px; color: white; font-weight: bold;">
        KLIK
    </button>
    <br><br>
    <img v-if="qrCodeData" :src="qrCodeData" alt="QR Code">
    <p v-else>Loading QR Code...</p>
</template>

<script setup>
import axios from 'axios';
import CryptoJS from "crypto-js"
import { ref } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter()
const urlParams = router.currentRoute.value.fullPath.split('/').slice(3).join('/')

const splitAmount = urlParams.split("|")[1]
const encryptAmount = CryptoJS.AES.decrypt(atob(splitAmount), 'U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=').toString(CryptoJS.enc.Utf8);

const qrCodeData = ref("");

const getData = async (amount) => {
    let data_amount = {
        "amount": "1500000.00"
    }

    try {
        const res = await axios({
            url: 'http://localhost:3001/payment/get/symmetric_signature',
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data_amount),
        })

        const body = {
            "amount": {
                "value": "1500000.00",
                "currency": "IDR"
            },
            "merchantId": "000002094",
            "terminalId": "A1026229",
            "partnerReferenceNo": res.data.requestBody.partnerReferenceNo,
            "validityPeriod": res.data.requestBody.validityPeriod.toString()
        };

        const headersData = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${res.data.accessToken}`,
            "X-Timestamp": res.data.timestamp,
            "X-External-ID": res.data.requestBody.partnerReferenceNo,
            "X-Partner-ID": '000002094',
            "X-Signature": res.data.signatureSymmetric,
            "Channel-ID": '95251'
        }

        try {
            const klikbca = await axios({
                url: 'http://localhost:3001/payment/get/qr_code',
                method: "POST",
                headers: {
                    ...headersData
                },
                data: JSON.stringify(body)
            })

            console.log(klikbca);

            if (klikbca.data && klikbca.data.qrImage) {
                qrCodeData.value = `data:image/png;base64, ${klikbca.data.qrImage}`;
            } else {
                console.error('Properti qrCodeBase64 tidak ditemukan dalam respons');
            }
            
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
}
</script>