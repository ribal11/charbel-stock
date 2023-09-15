<template>
  <div class="main">
    <div class="input q-mt-md">
      <label for="name">Client Name: </label>
      <q-input outlined v-model="name" placeholder="client name" />
    </div>
    <div class="add">
      <q-btn color="primary" label="Add" class="q-mr-md" @click="addItem" />
    </div>
    <div class="container">
      <q-table
        class="table"
        style="height: auto"
        flat
        bordered
        :rows="rowsClient"
        :columns="columnsCLient"
        row-key="index"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <!-- Custom "update" and "delete" columns -->

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
      <div style="text-align: center; margin-top: 16px">
        <q-btn flat color="primary" @click="handleAdd"> Save </q-btn>
      </div>
    </div>
  </div>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin card">
        <div class="search">
            <q-input
        v-model="search"
        debounce="500"
        filled
        placeholder="Search"
        class="q-mb-sm"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
        </div>
      <q-table
        class="table"
        style="height: auto"
        flat
        bordered
        :rows="searchItem"
        :columns="columnsStock"
        row-key="ItemSerialNumber"
        selection="multiple"
        
        v-model:selected="selected"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <!-- Existing columns... -->

        <!-- "client Qty" (quantity) input column -->
        <template v-slot:body-cell-quantity="props">
          <q-td :props="props">
            <q-input
              v-model="props.row.quantity"
              outlined
              type="number"
              min="0"
              :max="props.row.ItemQty"
              :disable="!selected.includes(props.row)"
            />
          </q-td>
        </template>
      </q-table>
      <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->

      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onDialogOK" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
import {useRouter} from 'vue-router'


//emits for the dialog
defineEmits([...useDialogPluginComponent.emits]);

const router = useRouter();
const { dialogRef, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar()

//columns of the stock
const columnsStock = [
  {
    name: "ItemSerialNumber",
    align: "center",
    label: "Item Serial Number",
    field: "ItemSerialNumber",
  },
  {
    name: "ItemName",
    label: "Item Name",
    field: "ItemName",
    align: "center",
  },
  { name: "StockQty", label: "Item Qty", field: "ItemQty", align: "center" },
  { name: "quantity", label: "client Qty", field: "quantity", align: "center" },
];
//column of the table client items
const columnsCLient = [
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
  { name: "delete", label: "delete", field: "delete", align: "center" },
];

//items available in the stock
const rowsStock = ref([
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
  {
    ItemSerialNumber: "3",
    ItemCategory: "Ice cream sandwich",
    ItemName: "Ice cream sandwich",
    ItemQty: 237,
    ItemSupplier: "Supplier B",
  },
  {
    ItemSerialNumber: "4",
    ItemCategory: "Ice cream sandwich",
    ItemName: "Ice cream sandwich",
    ItemQty: 237,
    ItemSupplier: "Supplier B",
  },
]);

//items of the client
const rowsClient = ref([]);

//name of the client
const name = ref("");

const selected = ref([]);

const search = ref('');



//add items to to fetoura
function addItem() {
  if (dialogRef.value) {
    dialogRef.value.show();
  }
}

 function handleAdd(){
    const data = {
        name: name.value,
        itemsClient: rowsClient.value,
        itemsStockUpdate: rowsStock.value
    }
    console.log(JSON.stringify(data));
    router.push('/home')
}


//submit the fetoura
//  async function handleAdd() {
//   if ( rowsClient.value.length === 0) {
//     $q.dialog({
//       title: "Alert",
//       message: "you did not enter any item cancel the bill?",
//       cancel:true,
//     }).onOk(() => {
//       router.push('/home');
//     }).onCancel(()=> console.log('cancel'));
//   } else if(name.value === ""){
//   $q.dialog({
//       title: "Alert",
//       message: "Please enter the client's name ",
//     }).onOk(() => {
//       console.log("OK");
//     });
// } else {
//     const data ={
//         name:name.value,
//         itemsClient:rowsClient.value,
//         itemsStockUpdate:rowsStock.value,
//     }
    
//     try{
//         const response = await fetch('https://locahost:3000/api/check',{
//             method:'post',
//             headers:{'Content-Type': 'application/json'},
//             body:JSON.stringify(data),
//         })

//         if(!response.ok){
//             throw new Error(`Error:${response.status}`)
//         } else {
//             router.push('/home');
//         }
//     } catch(err){
//         console.log(err);
//     }
//   }
// }

//delete an item
function handleDelete(row) {
  const item = rowsClient.value.find(
    (rowUser) => rowUser.ItemSerialNumber === row.ItemSerialNumber
  );
  const quatityToAdd = item.ItemQty;
  const itemStock = rowsStock.value.find(
    (rowUser) => rowUser.ItemSerialNumber === item.ItemSerialNumber
  );
  itemStock.ItemQty += Number(quatityToAdd);
  rowsClient.value = rowsClient.value.filter(
    (rowUser) => rowUser.ItemSerialNumber !== row.ItemSerialNumber
  );
}

//press the ok button
function onDialogOK() {
  rowsStock.value.forEach((row) => {
    //substract the quantity taken and adding the item to rowsClient
    if (row.quantity) {
      row.ItemQty = row.ItemQty - row.quantity;
      var merchandise = {
        ItemSerialNumber: row.ItemSerialNumber,
        ItemCategory: row.ItemCategory,
        ItemName: row.ItemName,
        ItemQty: row.quantity,
        ItemSupplier: row.ItemSupplier,
      };
      console.log(merchandise);
      console.log(rowsStock.value);
      rowsClient.value.push(merchandise);
    }
  });
  selected.value = [];
  dialogRef.value.hide();
}

//press the cancel button
function onDialogCancel() {
  selected.value = [];
  dialogRef.value.hide();
}

//get the stock data from the db and put it in the rowsStock
// async function getStockData(){
//   try{
//     const response= await fetch('http://localhost/stock');
//     const data = await response.json();
//     rowsStock.value = data
//   } catch(err){
//     console.log(err);
//   }
// }

//to see if we exeeded the quantity in the stock
watch(
  () => rowsStock.value,
  (newRows, oldRows) => {
    newRows.forEach((newRow, index) => {
      // Ensure the quantity doesn't exceed ItemQty
      if (newRow.quantity > newRow.ItemQty) {
        newRows[index].quantity = newRow.ItemQty;
      }
    });
  },
  { deep: true }
);


const searchItem = computed(() => {
  const searchValue = search.value.toLowerCase();
  
  if (searchValue.length === 0) {
    return rowsStock.value; // Return all rows if search is empty
  }

  return rowsStock.value.filter((row) =>
    row.ItemName.toLowerCase().includes(searchValue)
  );
});

watch(
  () => selected.value,
  (newSelected, oldSelected) => {
    if (oldSelected.length > newSelected.length) {
      rowsStock.value.forEach((row) => {
        if (!newSelected.includes(row)) {
          row.quantity = null;
        }
      });
    }
  }
);

//get the stock data onMounted
// onMounted(async ()=>{
//   getStockData();
// })
</script>

<style scoped>
label {
  display: inline-block;
  font-size: 24px;
  font-weight: 500;
}

.add {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}
.input {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: auto;
}

.search{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
