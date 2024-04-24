<template>
  <div>
    <div class="d-flex">
      <div class="me-3">
        <b>
          <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.push('/' + urlParams)"
            color="black"></v-icon>
        </b>
      </div>
      <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
    </div>
    <template v-for="data in vaStore.banks" :key="data.id_ewallet">
      <div v-if="data.is_activated">
        <CardBank :Subtitle="data.code" :Title="data.name" @click="createVirtualAccount(data.code, encryptAmount)"
          class="mb-3">
          <template #avatarImage>
            <v-avatar size="100" class="ms-4" rounded="0">
              <v-img :src="getBankLogo(data.code)"></v-img>
            </v-avatar>
          </template>
        </CardBank>
      </div>
    </template>
  </div>
  <v-dialog v-model="loading" persistent content-class="modal">
    <div class="text-center">
      <v-progress-circular :size="70" :width="7" color="#1867C0" indeterminate></v-progress-circular>
    </div>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useVaStore } from "@/stores/statePayment/useVirtualAccount";
import { useRouter } from "vue-router";
import bcaLogo from "@/assets/images/logo_bank/Bank-12.png"
import bniLogo from "@/assets/images/logo_bank/Bank-03.png";
import permataLogo from "@/assets/images/logo_bank/Bank-06.png";
import sahabatLogo from "@/assets/images/logo_bank/Bank-13.png";
import mandiriLogo from "@/assets/images/logo_bank/Bank-05.png";
import bjbLogo from "@/assets/images/logo_bank/BJB.png";
import briLogo from "@/assets/images/logo_bank/Bank-04.png";
import syariahLogo from "@/assets/images/logo_bank/Bank-07.png";
import CryptoJS from "crypto-js"

const vaStore = useVaStore();
const router = useRouter();
const loading = ref(false)
const urlParams = router.currentRoute.value.fullPath.split('/').slice(3).join('/')

onMounted(() => {
  vaStore.initialize();
});

const imageLogos = {
  BCA: bcaLogo,
  BNI: bniLogo,
  MANDIRI: mandiriLogo,
  PERMATA: permataLogo,
  SAHABAT_SAMPOERNA: sahabatLogo,
  BRI: briLogo,
  BSI: syariahLogo,
  BJB: bjbLogo
}

const getBankLogo = (bankCode) => {
  return imageLogos[bankCode]
}

const splitAmount = urlParams.split('|')[1]
// console.log(splitAmount);
const encryptAmount = CryptoJS.AES.decrypt(atob(splitAmount), 'U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0=').toString(CryptoJS.enc.Utf8);

const createVirtualAccount = async (id, encryptAmount) => {
  loading.value = true
  const result = await vaStore.createVirtualAccount(id, encryptAmount);
  if (result) {
    loading.value = false
    router.push(`${urlParams}/${id}`);
  } else {
    loading.value = false
    router.push(`${urlParams}/${id}`);
  }
};
</script>
<style>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>