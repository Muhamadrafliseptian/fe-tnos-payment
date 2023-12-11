<!-- <template>
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
import axios from 'axios'
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
  computed: {
    getInvoiceId(){
      localStorage.getItem("invoice_id")
    }
  },
  methods: {
    async getStatusLog(){
      try {
        axios.get('http://localhost:3001/payment/tnos-dbsqgc/get').then((response)=>{
          console.log(response.data.status);
        })
      } catch (er) {

      }
    }
  },
};
</script> -->


<template>
  <div>
    <div class="text-caption">
      <h6>Data:</h6>
      <p class="mb-0">Active VA Bank: {{ vaStore.activeVABank }}</p>
      <p>Active VA Bank Response: {{ vaStore.activeVABankResponse }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useVaStore } from "@/stores/statePayment/useVirtualAccount";

const vaStore = useVaStore();
const { $swal } = useNuxtApp();

onMounted(() => {
  vaStore.initialize();
  vaStore.getAllVirtualAccount();
});
</script>
