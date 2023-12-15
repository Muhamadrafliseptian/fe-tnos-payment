<template>
  <div>
    <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
    <template v-for="data in vaStore.banks" :key="data.id_ewallet">
      <div v-if="data.is_activated">
        <CardBank
          :Subtitle="data.code"
          :Title="data.name"
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
const router = useRouter()

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
