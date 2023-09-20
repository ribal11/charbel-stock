<template>
  <LoadingComponent v-if="isLoading" />
  <div class="row justify-end">
    <div class="col-6 col-sm-3 text-right">
      <q-btn color="primary" label="Add New Item" class="q-my-sm q-mr-sm" @click="addItem" />
    </div>

  </div>




  <q-table class="table" style="height: auto" flat bordered title="Stock" :rows="filteredData" :columns="columns"
    row-key="index" :rows-per-page-options="[0]" :visible-columns="visibleCols" :grid="$q.platform.is.mobile">

    <template v-slot:top-right>
      <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="fltr_text" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter = !show_filter" flat />
    </template>
    <!-- Custom "update" and "delete" columns -->
    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-update="props">
      <!-- Assuming props.row.update contains the update action -->
      <q-td :props="props">
        <q-btn flat round color="primary" icon="edit" @click="handleUpdate(props.row)" />
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-delete="props">
      <!-- Assuming props.row.delete contains the delete action -->
      <q-td :props="props">
        <q-btn flat round color="primary" icon="delete" @click="handleDelete(props.row)" />
      </q-td>
    </template>


    <template v-if="$q.platform.is.mobile" v-slot:item="props">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section class="text-left">
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


            <div class="row q-mt-sm">
              <span class="col-6 text-center">
                <q-btn color="primary" label="Edit" icon="edit" size="sm" @click="handleUpdate(props.row)" />
              </span>
              <span class="col-6 text-center">
                <q-btn color="negative" label="Delete" icon="delete_outline" size="sm" @click="handleDelete(props.row)" />
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </template>

  </q-table>
</template>
<script setup>

import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
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

const show_filter = ref(false);
const fltr_text = ref('');

const pagination = ref({
  rowsPerPage: 1000,
});

const visibleCols = ['serno', 'cat', 'name', 'qty', 'supp', 'update', 'delete']
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
  { name: "update", label: "update", field: null, align: "center", },
  { name: "delete", label: "delete", field: null, align: "center" },
];

const rows = ref([]);

function handleDelete(row) {
  $q.dialog({
    title: "Confirm",
    message: 'Are you sure you want to delete this stock Item?',
    cancel: true,
  }).onOk(() => {
    // rows.value = rows.value.filter((item) => item.ItemSerialNumber !== row.ItemSerialNumber)
    deleteItem(row.id);
  }).onCancel(() => {
    console.log('cancel');
  })

}

function handleUpdate(row) {
  router.push(`/home/edit/${row.id}`)
}
function addItem() {
  router.push('/home/add');
}

const getCols = computed(() => {
  const filteredColumns = columns.filter((col) =>
    col.name !== 'update'
    && col.name !== 'delete' && col.name !== 'id'
  );
  return filteredColumns
})


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

const deleteItem = async (itemid) => {
  try {
    setIsLoading(true);

    let resp = await fetch(`${ENV.HomeURL}/items/deleteItem?id=${itemid}`, { method: 'get', headers: { 'Accept': 'application/json' } });

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
      // resp = await resp.json();
      $q.notify({
        color: "positive",
        type: 'positive',
        textColor: "white",
        message: "Item Deleted Successfully",
        timeout: 2000
      });
      fetchData()

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
