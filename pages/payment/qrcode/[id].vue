<template>
    <div>
      <div class="d-flex">
        <div class="me-3">
          <b>
            <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.push('/')" color="black"></v-icon>
          </b>
        </div>
        <h6 class="mb-5">Bayar Dengan QRIS</h6>
      </div>
      <template v-for="data in qaStore.qrcodes" :key="data.id_qr">
        <div>
          <CardBank Subtitle="lorem ipsum dolor sit amet" :Title="data.channel_name"
            @click="handleQrCodeCreation(data.channel_code, encryptAmount)" class="mb-3">
            <template #avatarImage>
              <v-avatar size="100" class="ms-4" rounded="0">
                <v-img :src="logoBank"></v-img>
              </v-avatar>
            </template>
          </CardBank>
        </div>
      </template>
    </div>
  </template>
  
  <script setup>
  import logoBank from '@/assets/images/bca.png'
  import { ref, onMounted } from "vue";
  import { useQrStore } from "~/stores/statePayment/useQrCode";
  import { useRouter } from "vue-router";
  import CryptoJS from "crypto-js"
  
  const qaStore = useQrStore();
  const router = useRouter();
  
  const urlParams = router.currentRoute.value.fullPath.split('/').slice(3).join('/')

  onMounted(() => {
    qaStore.initialize();
  });

  const splitAmount = urlParams.split('|')[1]
  const encryptAmount = CryptoJS.AES.decrypt(atob(splitAmount), 'U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=').toString(CryptoJS.enc.Utf8);
  
  const handleQrCodeCreation = async (id, encryptAmount) => {
    const result = await qaStore.createQrCode(id, encryptAmount);
    if (result) {
      router.push(`${urlParams}/${id}`);
    } else {
      router.push(`${urlParams}/${id}`);
    }
  };
  </script>
  