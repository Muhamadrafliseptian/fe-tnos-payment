<template>
  <div>
    <h6 class="mb-5">Bayar Dengan Qr Code</h6>
    <template v-for="data in qaStore.qrcodes" :key="data.id_qr">
      <div>
        <CardBank
          :Subtitle="data.channel_code"
          :Title="data.channel_name"
          @click="handleQrCodeCreation(data.channel_code)"
          class="mb-3"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQrStore } from "~/stores/statePayment/useQrCode";
import { useRouter } from "vue-router";

const qaStore = useQrStore();
const router = useRouter();

onMounted(() => {
  qaStore.initialize();
  // qaStore.getQr();
});

const handleQrCodeCreation = async (id) => {
  const result = await qaStore.createQrCode(id);
  if (result) {
    router.push(`qrcode/${id}`);
  } else {
    router.push(`qrcode/${id}`);
  }
};
</script>
