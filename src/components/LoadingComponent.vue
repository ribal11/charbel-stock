<template>
  <div :class="`${props.centerScreen ? 'loading-screen-fixed' : 'loading-screen'}`">
    <div class="loading-spinner">
      <q-spinner color="primary" size="3em" :thickness="10" />
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  centerScreen: null
})
</script>
<style scoped>
.loading-screen {
  position: absolute;
  top: 0;
  left: 0;
  background-color: #d2e4e7;
  opacity: 0.4;
  height: 100%;
  width: 100%;
  z-index: 100000;
}

.loading-screen-fixed {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #d2e4e7;
  opacity: 0.4;
  height: 100%;
  width: 100%;
  z-index: 100000;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  /* opacity: 1 !important; */
  overflow: hidden;
}
</style>
