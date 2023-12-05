<template>
  <v-container style="max-width: 600px">
    <v-timeline density="compact" side="end">
      <v-timeline-item
        class="mb-4"
        dot-color="blue"
        size="small"
        v-for="(item, index) in datas"
        :key="index"
      >
        <div>
          {{ item }}
        </div>
      </v-timeline-item>
    </v-timeline>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      datas: [
        "Masukkan VIrtual Account yang Anda ingin bayarkan",
        "Masukan nominal, kemudian pilih Lanjutkan",
        "Konfirmasi Transaksi kemudian Lanjut Transfer",
        "Masukkan Pin Aplikasi",
        "Pembayaran Berhasil",
      ],
    };
  },
};
</script>
