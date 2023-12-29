<template>
  <div>
    <div class="d-flex">
      <div class="me-3">
        <b>
          <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="router.push('/')" color="black"></v-icon>
        </b>
      </div>
      <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
    </div>
    <template v-for="data in vaStore.banks" :key="data.id_ewallet">
      <div v-if="data.is_activated">
        <CardBank :Subtitle="data.code" :Title="data.name" @click="createVirtualAccount(data.code)" class="mb-3">
          <template #avatarImage>
            <v-avatar size="100" class="ms-4" rounded="0">
              <v-img :src="imageLogo[0]"></v-img>
            </v-avatar>
          </template>
        </CardBank>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useVaStore } from "@/stores/statePayment/useVirtualAccount";
import { useRouter } from "vue-router";
import bcaLogo from "@/assets/images/bca.png"
import bniLogo from "@/assets/images/bank_logos/bni.png";
import mandiriLogo from "@/assets/images/bank_logos/mandiri.png";
import bjbLogo from "@/assets/images/bank_logos/bjb.png";
import briLogo from "@/assets/images/bank_logos/bri.png";
import bsiLogo from "@/assets/images/bank_logos/bsi.png";

const imageLogo = [bniLogo, bjbLogo, briLogo, bsiLogo, mandiriLogo, bcaLogo];

const vaStore = useVaStore();
const router = useRouter();

onMounted(() => {
  vaStore.initialize();
});

const createVirtualAccount = async (id) => {
  const result = await vaStore.createVirtualAccount(id);
  if (result) {
    router.push(`virtualaccount/${id}`);
  } else {
    router.push(`virtualaccount/${id}`);
  }
};
</script>
