<template>
  <div>
    <h6>
      Sukses Bayar
    </h6>
    <!-- <p class="text-center">Halaman ini akan terclose otomatis dalam {{ countdown }} detik</p> -->
    <div v-if="paymentSuccess" class="text-center">
      <img src="../assets/images/success.png" alt="" class="img-fluid">
      <h5>Terima kasih, Pembayaran Telah Kami Terima</h5>
    </div>
  </div>
</template>

<script setup>
import { useRedirect } from "@/stores/statePayment/useRedirect";
// import { useRouter } from "vue-router";
// import { ref, onMounted } from "vue";

const vaStore = useRedirect();
// const router = useRouter();

const paymentSuccess = vaStore.paymentsuccess;
// const countdown = ref(10);

// onMounted(() => {
//   const countdownInterval = setInterval(() => {
//     countdown.value -= 1;

//     if (countdown.value === 0) {
//       clearInterval(countdownInterval);
//       router.push("/");
//     }
//   }, 1000);
// });
</script>
