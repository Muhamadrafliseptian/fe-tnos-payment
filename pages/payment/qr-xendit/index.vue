<template>
    <v-container>
        <div class="d-flex">
            <div class="me-3">
                <b>
                    <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" color="black"></v-icon>
                </b>
            </div>
            <h6 class="mb-5">Bayar Dengan QRIS</h6>
        </div>
        <v-card class="rounded-lg" color="grey-lighten-4">
            <v-card-text class="ms-3">
                <p class="mb-0">
                    <b class="text-secondary" color="grey">Selesaikan Pembayaran Anda Sebelum:</b>
                </p>
                <p class="mb-3" id="countdown">
                    <b> {{ expires }} </b>
                </p>
                <p class="mb-0">
                    <b class="text-secondary" color="grey">Sisa waktu pembayaran: </b>
                </p>
                <p class="mb-0" hidden>
                    Sisa Waktu Pembayaran:
                    <b class="text-secondary" color="grey">
                        {{ countdown }}
                    </b>
                </p>
                <p class="mb-3" v-if="countdown" id="countdown">
                    Sisa Waktu Pembayaran Ada:
                    <b class="text-secondary" color="grey">
                        {{ countdown }}
                    </b>
                </p>
                <p class="mb-0">
                    <b class="text-secondary" color="grey">Jumlah yang harus dibayar: </b>
                </p>
                <p>
                    <!-- <b> Rp. {{ transactionData?.amount }} </b> -->
                </p>
            </v-card-text>
        </v-card>
        <v-card class="rounded-xl mt-5" color="blue-accent-4" :elevation="12">
            <v-container>
                <v-row>
                    <v-col>
                        <v-img :src="qrCode"></v-img>
                    </v-col>
                    <v-col>
                        <!-- <v-img :src="imageGpn" :width="50" class="mt-5 ms-5" :height="50"></v-img> -->
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-container>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { useRedirect } from "~/stores/statePayment/useRedirect";
import { useRouter } from "vue-router";
import QRCode from "qrcode";

export default {
    setup() {
        const router = useRouter();
        const qrCode = ref(null);
        const expires = ref(null);
        const countdown = ref("");
        const config = useRuntimeConfig();
        const redirectStore = useRedirect();

        let timerId;
        let paymentProcessed = false;

        const updateCountdown = () => {
            const expirationDateUTC = new Date(expires.value);
            const options = {
                timeZone: "Asia/Jakarta",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            };

            const expirationDateLocal = expirationDateUTC.toLocaleString("en-US", options);
            const [date, time] = expirationDateLocal.split(", ");
            const [month, day, year] = date.split("/");

            const formattedDate = `${month}/${day}/${year} ${time} WIB`;
            expires.value = formattedDate;

            const [formattedMonth, formattedDay, formattedYear] = formattedDate.split(" ")[0].split("/");
            const [formattedHour, formattedMinute] = formattedDate.split(" ")[1].split(":");

            const expirationDate = new Date(`${formattedYear}-${formattedMonth}-${formattedDay}T${formattedHour}:${formattedMinute}:00+07:00`); // Jakarta is UTC+7
            const currentDate = new Date();

            const difference = expirationDate - currentDate;
            const menit = Math.floor(difference / (1000 * 60));
            const detik = Math.floor((difference % (1000 * 60)) / 1000);

            countdown.value = `${menit} Menit ${detik} Detik`;

            if (difference <= 0) {
                countdown.value = "Expired";
                clearInterval(timerId);
            }
        };

        const getData = async () => {
            try {
                if (paymentProcessed) {
                    return;
                }

                updateCountdown();
                timerId = setInterval(updateCountdown, 1000);

                paymentProcessed = true;
            } catch (error) {
                console.log(error);
            }
        };

        onMounted(() => {
            const qr = JSON.parse(localStorage.getItem("qr-xendit"));

            if (qr) {
                QRCode.toDataURL(qr.qr_string, (err, url) => {
                    if (err) console.error(err);
                    qrCode.value = url;
                });

                expires.value = qr.expires_at;
                redirectStore.setPaymentSuccess(true);

                getData();
            }
        });

        onUnmounted(() => {
            clearInterval(timerId);
        });

        return {
            qrCode,
            expires,
            countdown,
        };
    },
};
</script>
