<template>
    <img :src="qrData" v-if="qrData" />
</template>

<script>
import QRCode from 'qrcode';
export default {
    
    data() {
        return {
            qrData: '',
            message: '',
        };
    },
    mounted() {
        const qr = JSON.parse(localStorage.getItem("qr-xendit"));

        if (qr) {
            QRCode.toDataURL(qr.qr_string, (err, url) => {
                if (err) {
                    console.error(err);
                } else {
                    this.qrData = url;
                }
            });

            // Jika Anda perlu menggunakan `expires` dan `id`, tambahkan di sini
            // this.expires = qr.expires_at;
            // this.id = qr.id;
        }

        if (this.$socket) {
            this.$socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            this.$socket.on('messageToClient', (payload) => {
                this.message = payload;
                console.log("Message from server:", payload);

                const router = useRouter();

                localStorage.removeItem("qr-xendit")
                this.$router.push("/");
            });
        } else {
            console.error('Socket not initialized');
        }
    }
};
</script>
