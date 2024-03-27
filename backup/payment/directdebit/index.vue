<template>
    <div class="d-flex">
        <b class="me-3">
            <v-icon icon="mdi mdi-keyboard-backspace" class="mb-3" @click="this.$router.go(-1)" color="black"></v-icon>
        </b>
        <h6 class="mb-5">Bayar Dengan Direct Debit</h6>
    </div>
    <div v-for="datas in data[0]">
        <CardBank Subtitle="lorem ipsum dolor sit amet" class="mb-3" :Title="datas.title">
            <template #avatarImage>
                <v-avatar size="90" class="ms-4" rounded="0">
                    <v-img :src="Shopee"></v-img>
                </v-avatar>
            </template>
        </CardBank>
    </div>
</template>
<script setup>
import Shopee from '@/assets/images/bank_logos/shopee.png'
const router = useRouter();

const data = [
    {
        cardSatu: {
            id: "bridebit",
            title: "BRI Debit",
        },
        cardDua: {
            id: "bcaoneklik",
            title: "BCA ONE KLIK",
        },
    },
];

const postClick = (id) => {
    router.push(`/payment/${id}`);
};
</script>
  