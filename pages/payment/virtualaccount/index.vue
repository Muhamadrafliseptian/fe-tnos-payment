<template>
  <div>
    <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
    <template v-for="data in vaStore.banks">
      <div v-if="data.is_activated == true">
        <CardBank
          :Subtitle="data.code"
          :Title="data.name"
          :key="data.id_ewallet"
          @click="createVirtualAccount(data.code)"
          class="mb-3"
        />
      </div>
    </template>
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

function createVirtualAccount(id) {
  vaStore.createVirtualAccount(id);
}
</script>
