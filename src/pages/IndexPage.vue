<template>
  <LoadingComponent v-if="isLoading" />
  <div class="row justify-end">
    <div class="col-1">
      <q-btn color="primary" label="Add" class="q-my-sm" type="submit" @click="addItem" />
    </div>

  </div>

  <template v-if="!$q.platform.is.mobile">
    <div class="q-pa-md">

      <q-table class="table" style="height: auto" flat bordered title="Stock" :rows="rows" :columns="columns"
        row-key="index" :rows-per-page-options="[0]" :visible-columns="visibleCols">
        <!-- Custom "update" and "delete" columns -->
        <template v-slot:body-cell-update="props">
          <!-- Assuming props.row.update contains the update action -->
          <q-td :props="props">
            <q-btn flat round color="primary" icon="edit" @click="handleUpdate(props.row)" />
          </q-td>
        </template>

        <template v-slot:body-cell-delete="props">
          <!-- Assuming props.row.delete contains the delete action -->
          <q-td :props="props">
            <q-btn flat round color="primary" icon="delete" @click="handleDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </template>

  <template v-else>
    <div>
      <q-card v-for="(item) in rows" :key="item.ItemSerialNumber">
        <q-card-section v-for="(col, colIndex) in getCols" :key="colIndex" horizontal class="row">
          <q-card-section class="col title">
            {{ col.label }} :
          </q-card-section>
          <q-card-section class="col">
            {{ item[col.field] }}
          </q-card-section>
        </q-card-section>
        <q-card-actions class="row">
          <q-btn flat class="col bg-green" @click="handleUpdate(item)">Update</q-btn>
          <q-btn flat class="col bg-red" @click="handleDelete(item)">Delete</q-btn>
        </q-card-actions>
        <!-- Add other card content here -->
      </q-card>
    </div>
  </template>
</template>
<script setup>

import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useQuasar } from "quasar";
import ENV from "src/helpers/globals";

import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";


const $q = useQuasar();
const router = useRouter();

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

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
    align: "center",
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
    message: 'Are you sure you want to delete this row?',
    cancel: true,
  }).onOk(() => {
    rows.value = rows.value.filter((item) => item.ItemSerialNumber !== row.ItemSerialNumber)
  }).onCancel(() => {
    console.log('cancel');
  })

}

function handleUpdate(row) {
  router.push(`/home/delete/${row.id}`)
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



//Delete the row in the db and in the row constante

// async function handleDelete(row){

//   try{
//     rows.value = rows.value.filter((item) => item.ItemSerialNumber !== row.ItemSerialNumber)
//     const response =  await fetch(`https://localhost:300/api/delete/${row.ItemSerialNumber}`,{
//       method:'delete'
//     });
//     if(response.ok){
//       const error = new Error(
//               "Error deleting task: Server response not okay"
//             );
//             throw error;
//     }
//   } catch(Err){
//     console.log(Err);
//   }
// }


//Get the items data from the database to use them in the table

// async function getData() {
//   const api = 'route'
//   try {
//     const response = await fetch(api);
//     const data = await response.json();
//     rows.value = data;
//   } catch (err) {
//     console.log("this is the error:" + err);
//   }}


//use getData function onMounted

//   onMounted(() => {
//   getData(); // Call the getData function when the component is mounted

// }
// });


//reload the data from the database everytime we get back to this page

// onBeforeRouteUpdate(()=>{
//   getData();
// })

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
