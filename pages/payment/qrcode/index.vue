<template>
  <div>
    <h6 class="mb-5">Bayar Dengan Qr Code</h6>
    <template v-for="data in qaStore.qrcodes" :key="data.id_qr">
      <div>
        <CardBank
          :Subtitle="data.channel_code"
          :Title="data.channel_name"
          @click="createQrCode(data.code)"
          class="mb-3"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQrStore } from "~/stores/statePayment/useQrCode";

const qaStore = useQrStore();

onMounted(() => {
  qaStore.initialize();
  qaStore.getQr();
});

const createQrCode = (id) => {
  qaStore.createQrCode(id);
};
</script>
