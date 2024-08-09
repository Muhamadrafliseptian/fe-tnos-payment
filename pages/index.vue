<template>
  <div class="text-center">
    <img src="../assets/images/success.png" alt="" class="img-fluid" style="width: 600px" />
    <h5>Terima kasih Pembayaran Berhasil</h5>
  </div>
  <div class="text-center mt-5">
    <v-btn color="indigo" text="kembali" class="text-caption w-50" rounded="pill"></v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    };
  },
  mounted() {
    // Cek apakah $socket terdefinisi
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
    
    console.log("Ada");
  },
};
</script>