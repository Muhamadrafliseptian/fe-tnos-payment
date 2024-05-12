<template>
  <div class="text-center">
    <img src="../assets/images/success.png" alt="" class="img-fluid" style="width: 600px" />
    <h5>Terima kasih Pembayaran Berhasil</h5>
  </div>
  <div class="text-center mt-5">
    <v-btn color="indigo" text="kembali" class="text-caption w-50" rounded="pill"></v-btn>
  </div>
</template>

<script setup>
import { useRedirect } from "@/stores/statePayment/useRedirect";

const vaStore = useRedirect();

const paymentSuccess = vaStore.paymentsuccess;
</script>