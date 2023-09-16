<template>
<q-btn color="white" text-color="black" label="Add" class="q-my-md" type="submit"  @click="addItem"/>
<template v-if="!$q.platform.is.mobile">
  <div class="q-pa-md">
    
    <q-table
    class="table"
      style="height: auto"
      flat
      bordered
      title="Stock"
      :rows="rows"
      :columns="columns"
      row-key="index"
      virtual-scroll
      v-model:pagination="pagination"
      :rows-per-page-options="[0]"
    >
      <!-- Custom "update" and "delete" columns -->
      <template v-slot:body-cell-update="props">
        <!-- Assuming props.row.update contains the update action -->
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="edit"
            @click="handleUpdate(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-delete="props">
        <!-- Assuming props.row.delete contains the delete action -->
        <q-td :props="props">
          <q-btn
            flat
            round
            color="primary"
            icon="delete"
            @click="handleDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<template v-else>
<div>
        <q-card v-for="(item) in rows" :key="item.ItemSerialNumber">
          <q-card-section v-for="(col,colIndex) in getCols" :key="colIndex" horizontal class="row" >
            <q-card-section class="col title">
              {{ col.label }} :
            </q-card-section>
            <q-card-section class="col">
              {{item[col.field]}}
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
import {  onBeforeRouteUpdate, useRouter } from 'vue-router';
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const pagination = ref({
  rowsPerPage: 1000,
});
const columns = [

  {
    name: "ItemSerialNumber",
    align: "center",
    label: "Item Serial Number",
    field: "ItemSerialNumber",
  },
  {
    name: "ItemCategory",
    label: "Item Category",
    field: "ItemCategory",
    align: "center",
  },
  {
    name: "ItemName",
    label: "Item Name",
    field: "ItemName",
    align: "center",
  },
  { name: "ItemQty", label: "Item Qty", field: "ItemQty", align: "center" },
  {
    name: "ItemSupplier",
    label: "Item Supplier",
    field: "ItemSupplier",
    align: "center",
  },
  { name: "update", label: "update", field: "update", align: "center",},
  { name: "delete", label: "delete", field: "delete", align: "center" },
];

const rows = ref([
  {
    ItemSerialNumber: "1",
    ItemCategory: "Frozen Yogurt",
    ItemName: "Frozen Yogurt",
    ItemQty: 159,
    ItemSupplier: "Supplier A",

  },
  {
    ItemSerialNumber: "2",
    ItemCategory: "Ice cream sandwich",
    ItemName: "Ice cream sandwich",
    ItemQty: 237,
    ItemSupplier: "Supplier B",

  },
]);

function handleDelete(row){
  $q.dialog({
    title:"Confirm",
    message:'Are you sure you want to delete this row?',
    cancel:true,
  }).onOk(() => {
    rows.value=rows.value.filter((item)=> item.ItemSerialNumber !== row.ItemSerialNumber)
  }).onCancel(() => {
    console.log('cancel');
  })
 
}

function handleUpdate(row){
  router.push(`/home/delete/${row.ItemSerialNumber}`)
}
function addItem(){
  router.push('/home/add');
}

const getCols = computed(()=>{
  const filteredColumns = columns.filter((col) => col.name !== 'update' && col.name !== 'delete');
  return filteredColumns
})








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
.title{
  font-weight: 500;
}
</style>