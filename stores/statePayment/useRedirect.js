import { defineStore } from "pinia";

export const useRedirect = defineStore("redirectStore", {
    state() {
        return {
            paymentsuccess: false
        }
    }, 
    actions: {
        setPaymentSuccess(success){
            this.paymentsuccess = success
        }
    }
})