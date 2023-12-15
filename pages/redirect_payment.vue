<template>
  <div>
    <p class="text-center">Halaman ini akan terclose otomatis dalam {{ countdown }} detik</p>
    <div v-if="paymentSuccess" class="text-center">
      <img src="../assets/images/success.png" alt="" class="img-fluid">
      <h5>Terima kasih, Pembayaran Telah Kami Terima</h5>
    </div>
  </div>
</template>

<script setup>
import { useVaStore } from "@/stores/statePayment/useVirtualAccount";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const vaStore = useVaStore();
const router = useRouter();

const paymentSuccess = vaStore.paymentSuccess;
const countdown = ref(10);

onMounted(() => {
  // Update countdown every second
  const countdownInterval = setInterval(() => {
    countdown.value -= 1;

    if (countdown.value === 0) {
      clearInterval(countdownInterval);
      router.push("/");
    }
  }, 1000);
});
</script>
