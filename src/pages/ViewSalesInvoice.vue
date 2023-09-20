<template>
  <LoadingComponent v-if="isLoading" />
  <q-card class="q-pa-md q-ma-sm">
    <div class="row  items-center">
      <div class="col-12 col-md-4">
        <q-input filled ref="visitDateRef" v-model="visitBeginningDate" mask="####-##-##" label="Start Date"
          :rules="[dateValidation]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="visitBeginningDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-1" />
      <div class="col-12 col-md-4">
        <q-input filled ref="visitDateRef" v-model="visitEndDate" mask="####-##-##" label="End Date"
          :rules="[dateValidation]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="visitEndDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-1" />
      <div class="col-12 col-md-1 text-right ">
        <q-btn color="primary" push label="Apply" />
      </div>




    </div>


    <div>
      <q-table class="q-mt-sm" flat bordered title="Sales Invoices" :rows="filteredData" :columns="columns"
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

        <template v-if="!$q.platform.is.mobile" v-slot:body-cell-view="props">
          <!-- Assuming props.row.delete contains the delete action -->
          <q-td :props="props">
            <q-btn flat round color="primary" icon="visibility" @click="handleView(props.row)" />
          </q-td>
        </template>


        <template v-if="$q.platform.is.mobile" v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card flat bordered>
              <q-card-section class="text-left">
                <div class="row">
                  <span class="col-12  text-weight-bolder   ">
                    Client Name
                  </span>
                  <span class="col-12">
                    {{ props.row.name }}
                  </span>
                </div>
                <div class="row">
                  <span class="col-12  text-weight-bolder">
                    Invoice Date
                  </span>
                  <span class="col-12">
                    {{ props.row.date }}
                  </span>
                </div>


                <div class="row q-mt-sm">
                  <span class="col-6 text-center">
                    <q-btn color="primary" label="Edit" icon="edit" size="sm" @click="handleUpdate(props.row)" />
                  </span>
                  <span class="col-6 text-center">
                    <q-btn color="positive" label="view" icon="visibility" size="sm" @click="handleView(props.row)" />
                  </span>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>

      </q-table>
    </div>

    <q-dialog ref="dialogRef">

      <q-card class="q-dialog-plugin">

        <q-card-actions align="right">
          <q-btn color="primary" flat push label="OK" @click="onDialogOK" />
        </q-card-actions>

        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Name</label>
          <q-input v-model="rowData.name" debounce="500" filled class="q-mb-sm" disable="" />
        </q-card-section>

        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">date</label>
          <q-input v-model="rowData.date" debounce="500" filled class="q-mb-sm" disable="" />
        </q-card-section>
        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">items</label>
          <q-card v-for="(item, index) of rowData.items " :key="index" class="q-mt-sm">
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Serial Number</label>
              <q-input v-model="item.serialNumber" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Name</label>
              <q-input v-model="item.name" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Category</label>
              <q-input v-model="item.category" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Quantity</label>
              <q-input v-model="item.quantity" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog ref="dialogRefEdit">

      <q-card class="q-dialog-plugin">

        <q-card-actions align="right">
          <q-btn color="primary" flat push label="OK" @click="onDialogUpdateOK" />
          <q-btn color="primary" flat push label="cancel" @click="onDialogCancel" />
        </q-card-actions>

        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Name</label>
          <q-input v-model="rowData.name" debounce="500" filled class="q-mb-sm" />
        </q-card-section>

        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">date</label>
          <q-input v-model="rowData.date" debounce="500" filled class="q-mb-sm" disable="" />
        </q-card-section>
        <q-card-section>
          <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">items</label>
          <q-card v-for="(item, index) of rowData.items " :key="index" class="q-mt-sm">
            <!-- <q-card-actions>
            <q-btn flat round color="negative" icon="delete" @click="DeleteItemFromInvoice(item)" />
          </q-card-actions> -->
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Serial Number</label>
              <q-input v-model="item.serialNumber" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Name</label>
              <q-input v-model="item.name" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Category</label>
              <q-input v-model="item.category" debounce="500" filled class="q-mb-sm" disable="" />
            </q-card-section>
            <q-card-section>
              <label for="id" :class="$q.platform.is.mobile ? 'label' : ''">Quantity</label>
              <q-input v-model="item.quantity" debounce="500" filled class="q-mb-sm" />
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
    <button @click="check">check</button>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from 'quasar';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ENV from "src/helpers/globals";
import { useDialogPluginComponent } from 'quasar'
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { customTableSearch } from "src/helpers/utils";

defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])

const check = () => {
  console.log(rowsInvoice.value);
}
const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;
const $q = useQuasar();


//date variables
const dateValidation = v => v === '____-__-__' ||
  v === '' || (date.isValid(v)) || 'Please Enter A Valid Date';
const visitBeginningDate = ref("");
const visitEndDate = ref("");

//rows
const rowsStock = ref([{
  name: 'test',
  category: 'reactor',
  serialNumber: 40,
  quantity: 25,
  id: 1
},
{
  name: 'test1',
  category: 'reactor1',
  serialNumber: 42,
  quantity: 30,
  id: 2
}])


const rowsInvoice = ref([
  {
    id: 1,
    name: 'test',
    date: '2023-09-24',
    items: [
      {
        name: 'test',
        category: 'reactor',
        serialNumber: 40,
        quantity: 20,
        id: 1
      },
      {
        name: 'test1',
        category: 'reactor1',
        serialNumber: 42,
        quantity: 23,
        id: 2
      }
    ]
  }
])



//columns
const visibleCols = ['name', 'date', 'update', 'view']
const columns = [
  {
    name: 'id',
    field: 'id'
  },
  {
    name: 'date',
    field: 'date',
    label: 'Invoice Date',
    align: 'center'
  },
  {
    name: "name",
    label: "Client Name",
    field: "name",
    align: "left",
  },

  { name: "update", label: "Update", field: null, align: "center", },
  { name: "view", label: "View", field: null, align: "center" },
];



//search bar
const fltr_text = ref("");
const show_filter = ref(false);

//dialog
const dialogRef = ref(null)
let rowData = ref([])
let baserowData = reactive({})
const onDialogOK = () => {
  dialogRef.value.hide()
}

//edit dialog
const dialogRefEdit = ref(null)
const onDialogCancel = () => {
  dialogRefEdit.value.hide()
}



//functions

const handleView = (row) => {

  rowData.value = rowsInvoice.value.find((rowItem) => row.id === rowItem.id);
  dialogRef.value.show()
}


const handleUpdate = (row) => {
  rowData.value = cloneDeep(rowsInvoice.value.find((rowItem) => row.id === rowItem.id));
  dialogRefEdit.value.show()
}

const onDialogUpdateOK = async () => {
  let check = true
  for (const updatedRow of rowData.value.items) {
    let rowInvoice = rowsInvoice.value.find((row) => row.id === rowData.value.id)

    let updatedIdQuantity = updatedRow.id
    //updated quantity
    let updatedQuantity = updatedRow.quantity
    let rowInvoiceItem = rowInvoice.items.find((row) => row.id === updatedIdQuantity)
    //base quantity
    let rowInvoiceItemQuantity = rowInvoiceItem.quantity;
    //stock qty
    let stockItem = rowsStock.value.find((row) => row.id === updatedIdQuantity)
    let qty = rowInvoiceItemQuantity - updatedQuantity;
    console.log('row :' + rowInvoiceItemQuantity);
    console.log('row2: ' + updatedQuantity);
    let test = cloneDeep(stockItem.quantity);
    test += qty;
    console.log(test);
    if (test < 0) {
      await $q.dialog({
        color: "red-5",
        textColor: "white",
        icon: 'warning',
        message: "quantity exceed tht of the stock for" + updatedRow.name
      }).onOk(() => {
        updatedQuantity = 0;

        console.log('work');
        return
      })
      check = false;
    } else {
      stockItem.quantity += qty;
      rowInvoiceItem.quantity = updatedQuantity
      console.log('thi is' + rowInvoiceItemQuantity);
      // updateStock(updatedRow.id);
      // updateInvoice();


    }
  }
  if (!check) {
    return;
  } else {
    dialogRefEdit.value.hide();
  }

}

//computed
const filteredData = computed(() => {
  let data;
  data = rowsInvoice.value;
  if (fltr_text.value === '') {

    return cloneDeep(data)
  }
  else {
    return customTableSearch(fltr_text.value, data)
  }
})


// onMounted(async () => {
//   await getStockData();
//   await getInvoiceData()
// })

watch(
  () => rowsInvoice.value,
  (newSelected, oldSelected) => {
    newSelected.forEach((row) => {
      console.log(row.items);
    });
  }, { deep: true }
);

</script>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.label {
  display: block;

}
</style>
