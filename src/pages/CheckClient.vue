//add edit here and create dd dialog for delete in index

<template>
  <div class="main">
    <template v-if="!$q.platform.is.mobile">
      <div class="input q-mt-md">
      <label class="q-mr-sm" for="name">Client Name: </label>
      <q-input outlined v-model="name" placeholder="client name" />
    </div>
    </template>

    <template v-else>
      <div class="relative-position d-flex justify-center align-center">
    <q-input outlined v-model="name" placeholder="client name" class="q-ma-md q-pa-md" />
  </div>
    </template>
    <div class="add">
      <q-btn color="primary" label="Add" class="q-mr-md" @click="addItem" />
    </div>
    <template v-if="!$q.platform.is.mobile">
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
    </template>

    <template v-else>
      <div>
        <q-card v-for="item in rowsClient" :key="item.ItemSerialNumber">
          <q-card-section
            v-for="(col, colIndex) in getCols"
            :key="colIndex"
            horizontal
            class="row"
          >
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
        <div style="text-align: center; margin-top: 16px">
          <q-btn flat color="primary" @click="handleAdd" v-if="!isEmpty">
            Save
          </q-btn>
        </div>
        <div class="center">
          <p v-if="isEmpty" class="empty-message">No rows yet</p>
          <!-- Your other template content -->
        </div>
      </div>
    </template>
  </div>

  <q-dialog ref="dialogRefUpdate">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <label for="id">Serial Number</label>
        <q-input
          v-model="getUpdate.ItemSerialNumber"
          debounce="500"
          filled
          class="q-mb-sm"
          disable=""
        />
      </q-card-section>

      <q-card-section>
        <label for="category">Category</label>
        <q-input
          v-model="getUpdate.ItemCategory "
          debounce="500"
          filled
          class="q-mb-sm"
          disable
        />
      </q-card-section>

      <q-card-section>
        <label for="name">Name</label>
        <q-input
          v-model="getUpdate.ItemName"
          debounce="500"
          filled
          disable
          class="q-mb-sm"
        />
      </q-card-section>

      <q-card-section>
        <label for="qty">Quantity</label>
        <q-input
          v-model="getUpdate.ItemQty"
          debounce="500"
          filled
          class="q-mb-sm"
        />

        <q-card-section>
        <label for="supplier">Supplier</label>
        <q-input
          v-model="getUpdate.ItemSupplier"
          debounce="500"
          filled
          class="q-mb-sm"
          disable
        />
      </q-card-section>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="OK" @click="onOKClickUpdate" />
        <!-- <q-btn color="primary" label="Cancel" @click="onDialogCancelUpate" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>




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
      <template v-if="!$q.platform.is.mobile">
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
      </template>

      <template v-else>
        <q-card v-for="(item) in searchItem" :key="item.ItemSerialNumber">
          <q-card-section>
            <q-checkbox v-model="selected" :val="item" color="green"  />
          </q-card-section>
          <q-card-section
            v-for="(col, colIndex) in getColsSupp"
            :key="colIndex"
            horizontal
            class="row"
          >
            <q-card-section class="col title">
              {{ col.label }} :
            </q-card-section>
            <q-card-section class="col">
              <div class="q-mt-md">{{ item[col.field] }}</div>
            </q-card-section>
          </q-card-section>
          <q-card-section horizontal class="row">
            <q-card-section class="title col"> quantity: </q-card-section>
            <q-card-section class="col">
              <q-input
                v-model="item.quantity"
                outlined
                type="number"
                min="0"
                :max="item.quantity"
                :disable="!selected.includes(item)"
                :placeholder="!selected.includes(item)?'disabled' :''"
              />
            </q-card-section>
          </q-card-section>
          <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->

          <!-- Add other card content here -->
        </q-card>
      </template>
      <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->

      <q-card-actions class="buttonspace">
        <q-btn color="primary" label="OK" @click="onDialogOK" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch, onMounted, reactive } from "vue";
import { useDialogPluginComponent, useQuasar } from "quasar";
import { useRouter } from "vue-router";

//emits for the dialog
defineEmits([...useDialogPluginComponent.emits]);

const router = useRouter();
const { dialogRef, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar();

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
  {name: 'update' , label: "update", field:"update", align:"center"},
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

const dialogRefUpdate =ref(null)
//name of the client
const name = ref("");

const selected = ref([]);

const search = ref("");
var getUpdate = reactive({})
var baseQty = ref("")

let StockData = ref("")

//add items to to fetoura
function addItem() {
  if (dialogRef.value) {
    dialogRef.value.show();
  }
}

function handleAdd() {
  const data = {
    name: name.value,
    itemsClient: rowsClient.value,
    itemsStockUpdate: rowsStock.value,
  };
  console.log(JSON.stringify(data));
  router.push("/home");
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
  $q.dialog({
    title:"Confirm",
    message:"Are you sure to delete this row ?",
    cancel:true
  }).onOk(() => {
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
  )
  }).onCancel(() => console.log('cancel'))

}

  function handleUpdate(row){
     baseQty.value = row.ItemQty
     getUpdate = rowsClient.value.find((rowItem) => row.ItemSerialNumber === rowItem.ItemSerialNumber);

  dialogRefUpdate.value.show()
}

function onOKClickUpdate() {
  let check = true
  // Find the index of the item to update in rowsClient
  const indexToUpdate = rowsClient.value.findIndex(
    (row) => row.ItemSerialNumber === getUpdate.ItemSerialNumber
  );

  if (indexToUpdate !== -1) {
    // Update the quantity of the item in rowsClient
    rowsClient.value[indexToUpdate].ItemQty = getUpdate.ItemQty;
  }

  // Calculate the change in quantity
  const qtyChange = baseQty.value - getUpdate.ItemQty;


  if (qtyChange !== 0) {
    const stockItemToUpdate = rowsStock.value.find(
      (row) => row.ItemSerialNumber === rowsClient.value[indexToUpdate].ItemSerialNumber
    );
    let test

    if (stockItemToUpdate) {
  StockData.value = stockItemToUpdate.ItemQty;
  // Remove 'let test' from here

  // Update the stock quantity based on the change
  if (qtyChange > 0) {
    stockItemToUpdate.ItemQty += qtyChange;

    console.log('it is ' + stockItemToUpdate.ItemQty);
    if (stockItemToUpdate.ItemQty < 0) {
      check = false;// Check stockItemToUpdate.ItemQty directly
      $q.dialog({
        title: "error",
        message: "quantity exceeds that of the stock"
      }).onOk(() => {
        rowsClient.value[indexToUpdate].ItemQty = 0;
        getUpdate.ItemQty = 0;

      });
    }
  } else {
    stockItemToUpdate.ItemQty -= Math.abs(qtyChange);
    if (stockItemToUpdate.ItemQty < 0) {
      check = false; // Check stockItemToUpdate.ItemQty directly
      $q.dialog({
        title: "error",
        message: "quantity exceeds that of the stock"
      }).onOk(() => {
        rowsClient.value[indexToUpdate].ItemQty = 0;
        getUpdate.ItemQty = 0;

      });
    }
  }
}

  }
  if(!check){
    return;
  }
  // Hide the dialog
  dialogRefUpdate.value.hide();

  // Log the updated rowsClient for debugging
  console.log(rowsClient.value);
}


//press the ok button
function onDialogOK() {
  rowsStock.value.forEach((row) => {
    if (row.quantity) {
      row.ItemQty = row.ItemQty - row.quantity;
      const foundIndex = rowsClient.value.findIndex(
        (rowItem) => rowItem.ItemSerialNumber === row.ItemSerialNumber
      );

      if (foundIndex !== -1) {
        // Item with the same ItemSerialNumber exists in rowsClient
        rowsClient.value[foundIndex].ItemQty =
          Number(row.quantity) + Number(rowsClient.value[foundIndex].ItemQty);
       row.quantity = "";
      } else {
        // Item with ItemSerialNumber not found, add it to the rowsClient array
        const merchandise = {
          ItemSerialNumber: row.ItemSerialNumber,
          ItemCategory: row.ItemCategory,
          ItemName: row.ItemName,
          ItemQty: row.quantity,
          ItemSupplier: row.ItemSupplier,
        };
        console.log(merchandise);
        console.log(rowsStock.value);
        rowsClient.value.push(merchandise);
        row.quantity = "";

      }
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

// function onDialogHideUpdate(){
//   dialogRefUpdate.value.show()
// }


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


const searchItem = computed(() => {
  const searchValue = search.value.toLowerCase();

  if (searchValue.length === 0) {
    return rowsStock.value; // Return all rows if search is empty
  }

  return rowsStock.value.filter((row) =>
    row.ItemName.toLowerCase().includes(searchValue)
  );
});

const getCols = computed(() => {
  return columnsCLient.filter((col) => col.name !== "delete" && col.name !== 'update');
});

const isEmpty = computed(() => {
  if (rowsClient.value.length === 0) {
    return true;
  } else {
    return false;
  }
});

const getColsSupp = computed(() => {
  return columnsStock.filter(
    (col) => col.name !== "delete" && col.name !== "quantity"
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
watch(
  () => rowsStock.value,
  (newRows, oldRows) => {
    newRows.forEach((newRow, index) => {
      // Ensure the quantity doesn't exceed ItemQty

      if (newRow.ItemQty < 0) {
        // Reset the stock quantity to the previous value
        newRow.ItemQty = StockData.value;
        console.log(newRow.ItemQty);
      } else if (newRow.quantity > newRow.ItemQty) {
        $q.dialog({
          title: 'Error',
          message: 'You only have ' + newRow.ItemQty + ' pcs'
        }).onOk(() => {
          newRows[index].quantity = '';
        });
      }
    });
  },
  { deep: true }
);

// watch (() => rowsStock.value,(newRows,oldRows) => {
//   newRows.forEach
// })







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

.search {
  display: flex;
  justify-content: center;
  align-items: center;
}
.empty-message {
  font-size: 2rem; /* Adjust the font size as needed */
  color: #888; /* Gray color */
  opacity: 0.5; /* Reduced opacity */
}
.title {
  font-weight: 500;
}

.cardstyle {
  display: flex;
  justify-content: center;
  align-items: center;
}

.buttonspace {
  display: flex;
  justify-content: space-between;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* This centers content vertically */
}
p {
  margin: 0;
  padding: 0;
}
</style>
