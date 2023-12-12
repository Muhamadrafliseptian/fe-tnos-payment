<template>
  <h6>{{ route.params.idVa[0] }}</h6>
  <div v-if="messageExpired" class="text-center">
    <p class="mb-0">{{ messageExpired }}</p>
    <p class="mb-0">Silahkan pilih metode pembayaran lagi</p>
    <v-btn class="text-caption" text="kembali" color="blue"></v-btn>
  </div>
  <div v-else>
    <v-card color="grey-lighten-5" class="text-caption">
      <v-card-text>
        <p class="mb-0">
          Status: <b>{{ transactionData?.status }}</b>
        </p>
        <p class="mb-0">
          Tenggat Waktu Pembayaran: <b>{{ expireDate }} WIB</b>
        </p>
        <p class="mb-0">
          Virtual Account: <b>{{ transactionData?.account_number }}</b>
        </p>
      </v-card-text>
    </v-card>
    <h6 class="mt-5">Tata cara bayar dari ATM {{ route.params.idVa[0] }}</h6>
    <v-card class="mt-4">
      <v-container>
        <v-timeline density="compact" side="end">
          <v-timeline-item
            class="mb-4"
            dot-color="indigo"
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
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useVaStore } from "@/stores/statePayment/useVirtualAccount";

const vaStore = useVaStore();
const transactionData = ref();
const expireDate = ref();
const messageExpired = ref();
const route = useRoute();
const datas = [
  "Masukkan VIrtual Account yang Anda ingin bayarkan",
  "Masukan nominal, kemudian pilih Lanjutkan",
  "Konfirmasi Transaksi kemudian Lanjut Transfer",
  "Masukkan Pin Aplikasi",
  "Pembayaran Berhasil",
];

onMounted(() => {
  vaStore.initialize();
  vaStore.getAllVirtualAccount();
  getData();
  getItemLocal();
});

const getItemLocal = (id) => {
  const dataVirtualAccount = localStorage.getItem("virtualAccountData");
  console.log(dataVirtualAccount);
};

const getData = () => {
  try {
    axios
      .get(
        `http://localhost:3001/payment/INV-TNOS123/${route.params.idVa[0]}/tnos-lscwhs/get`
      )
      .then((response) => {
        const expirationDateUTC = new Date(response.data.expiration_date);

        const options = { timeZone: "Asia/Jakarta" };
        const expirationDateLocal = expirationDateUTC.toLocaleString(
          "id-ID",
          options
        );
        transactionData.value = response.data;
        expireDate.value = expirationDateLocal;
        const timeOut = 7 * 60 * 1000;
        if (response.data.status !== "PAID") {
          setTimeout(getData, timeOut);
          messageExpired.value = response.data.message;
        }
      });
  } catch (er) {
    console.log(er);
  }
};
</script>
