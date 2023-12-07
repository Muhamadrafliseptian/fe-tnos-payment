<template>
  <div>
    <h6 class="mb-5">Bayar Dengan Virtual Account</h6>
    <template v-for="data in bank">
      <template v-if="isLoading">
        <v-skeleton-loader type="paragraph"></v-skeleton-loader>
      </template>
      <CardBank
        v-else
        :Subtitle="data.code"
        :Title="data.name"
        :key="data.id_ewallet"
        @click="createVirtualAccount(data.code)"
        class="mb-3"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const bank = ref([]);
const isLoading = ref(false);
const error = ref(null);
const { $swal } = useNuxtApp();
const router = useRouter()

onMounted(getBank);

async function getBank() {
  try {
    isLoading.value = true;
    const response = await axios.get("http://127.0.0.1:3001/payment/bank");
    bank.value = response.data;
  } catch (error) {
    console.error("Error fetching bank data:", error);
    error.value = "Error fetching bank data";
  } finally {
    isLoading.value = false;
  }
}

async function createVirtualAccount(id) {
  try {
    const response = await axios.post(
      "http://127.0.0.1:3001/payment/virtualaccount",
      {
        bank_code: id,
      }
    );

    if (response.data.error) {
      $swal.fire({
        title: "Galat!",
        text: response.data.error.message,
        icon: "error",
      });
    } else {
      $swal.fire({
        title: "Success!",
        text: 'Berhasil buat VA',
        icon: "success",
      });
      router.push(`/payment/virtualaccount/${id}`);
    }
  } catch (error) {
    console.error("Error creating virtual account:", error);
  }
}
</script>
