<template>
  <q-card :class="`q-pa-md ${$q.platform.is.mobile ? 'dimensions-on-dialog' : 'dimensions-on-dialog-fixed'}`">
    <LoadingComponent v-if="isLoading" />

    <q-table class="table" :style="{ 'height': `${0.8 * $q.screen.height}px` }" dense flat bordered title="Stock Search"
      :rows="filteredData" :columns="columns" row-key="id" :rows-per-page-options="[0]" :visible-columns="visibleCols"
      :grid="$q.platform.is.mobile" selection="multiple" v-model:selected="selectedRow"
      @selection="$details => rowSelected($details)" :hide-header="$q.platform.is.mobile">

      <template v-slot:top-right>
        <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="fltr_text" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter = !show_filter" flat />
        <q-slide-transition>
          <q-btn v-show="selectedRow.length > 0" label="Apply" color="primary" flat push @click="$ev => onApply()" />

        </q-slide-transition>
        <q-btn label="Cancel" color="negative" flat push @click="onCancel" />
      </template>
      <!-- Custom "update" and "delete" columns -->

      <template v-if="$q.platform.is.mobile" v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="text-left">
              <q-checkbox dense v-model="props.selected" />
              <div class="row">
                <span class="col-12  text-weight-bolder   ">
                  Serial Number
                </span>
                <span class="col-12">
                  {{ props.row.serno }}
                </span>
              </div>
              <div class="row">
                <span class="col-12  text-weight-bolder">
                  Category
                </span>
                <span class="col-12">
                  {{ props.row.cat }}
                </span>
              </div>
              <div class="row">
                <span class="col-12  text-weight-bolder">
                  Name
                </span>
                <span class="col-12">
                  {{ props.row.name }}
                </span>
              </div>


              <div class="row">
                <span class="col-12  text-weight-bolder">
                  Quantity
                </span>
                <span class="col-12">
                  {{ props.row.qty }}
                </span>
              </div>
              <div class="row">
                <span class="col-12  text-weight-bolder">
                  Supplier
                </span>
                <span class="col-12">
                  {{ props.row.supp }}
                </span>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>

    </q-table>
  </q-card>
</template>
<script setup>

import { computed, onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { useQuasar } from "quasar";
import ENV from "src/helpers/globals";

import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { customTableSearch } from "src/helpers/utils";

const $q = useQuasar();
const router = useRouter();

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

const props = defineProps({
  onDialogOK: null,
  onDialogCancel: null,
  onDialogHide: null,
  componentProps: null

})

const show_filter = ref(false);
const fltr_text = ref('');
const selectedRow = ref([]);


const visibleCols = ['serno', 'cat', 'name', 'qty', 'supp']
const columns = [
  {
    name: 'id',
    field: 'id'
  },

  {
    name: "serno",
    align: "center",
    label: "Item Serial Number",
    field: "serno",
  },
  {
    name: "cat",
    label: "Item Category",
    field: "cat",
    align: "center",
  },
  {
    name: "name",
    label: "Item Name",
    field: "name",
    align: "left",
  },
  { name: "qty", label: "Item Qty", field: "qty", align: "center" },
  {
    name: "supp",
    label: "Item Supplier",
    field: "supp",
    align: "center",
  },

];

const rows = ref([]);

const rowSelected = (data) => {
  console.log(selectedRow.value)
  // debugger

}



onMounted(() => {
  fetchData();
})

const fetchData = async () => {
  try {
    setIsLoading(true);

    let resp = await fetch(`${ENV.HomeURL}/items/getItems`, { method: 'get', headers: { 'Accept': 'application/json' } });

    if (!resp.ok) {
      resp = await resp.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    }
    else {
      resp = await resp.json();
      rows.value = resp;
    }


  }
  catch (err) {
    console.log(err);
  }
  finally {
    setIsLoading(false);
  }
}


const filteredData = computed(() => {
  if (fltr_text.value === '') {

    return cloneDeep(rows.value)
  }
  else {

    return customTableSearch(fltr_text.value, rows.value)
  }



})
const onApply = () => {

  props.onDialogOK([...selectedRow.value])
}

const onCancel = () => {
  props.onDialogCancel();
}


</script>

<style scoped>
.horizontal-card {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.title {
  font-weight: 500;
}
</style>
