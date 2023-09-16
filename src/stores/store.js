import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useStore = defineStore('store', () => {
  const isLoading = ref(false);
  const setIsLoading = (v) => {
    isLoading.value = v
  }



  return { isLoading, setIsLoading }
})
