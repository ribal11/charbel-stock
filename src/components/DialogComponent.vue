<template>
  <q-dialog class="full-parent" ref="dialogRef" @hide="onDialogHide" style="position: relative ;
  " :persistent="props.persistant">
    <component :is="props.componentToRender"
      v-bind="{ onDialogOK, onDialogCancel, componentProps: { ...props.componentToRenderProps } }" />
  </q-dialog>
</template >



<script setup >
import { useDialogPluginComponent } from 'quasar';
import { defineProps, ref, computed } from 'vue';
import { cloneDeep } from 'lodash'
const props = defineProps({
  componentToRender: null,
  componentToRenderProps: null,
  persistant: null

})



defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();




</script>


<style scoped>
/* .full-parent {
  width: 100%;
  height: 100%;
} */
</style>

