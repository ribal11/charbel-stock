<template>
  <LoadingComponent v-if="isLoading" />
  <q-card class="q-pa-md q-ma-sm">
    <div class="cardTitle cardTitleSticky">
      Purchase Invoices
    </div>
    <div class="row  items-center">
      <div class="col-12 col-md-4">
        <q-input filled ref="visitDateRef" v-model="invoiceStrDate" mask="####-##-##" label="Start Date"
          :rules="[dateValidation]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="invoiceStrDate" mask="YYYY-MM-DD">
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
        <q-input filled ref="visitDateRef" v-model="invoiceEndDate" mask="####-##-##" label="End Date"
          :rules="[dateValidation]">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="invoiceEndDate" mask="YYYY-MM-DD">
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
        <q-btn color="primary" push label="Apply" @click="fetchData" />
      </div>
    </div>
    <div>
      <q-table class="q-mt-sm" flat bordered title="" :rows="filteredData" :columns="columns" row-key="index"
        :rows-per-page-options="[0]" :visible-columns="visibleCols" :grid="$q.platform.is.mobile">

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
        <template v-if="!$q.platform.is.mobile" v-slot:body-cell-arrived="props">
          <q-td :props="props">

            <div class="q-pa-md">
              <q-checkbox v-model="props.row.state" true-value=1 false-value=0 @click="change(props.row)" />
            </div>

          </q-td>

        </template>

        <template v-if="!$q.platform.is.mobile" v-slot:body-cell-view="props">
          <!-- Assuming props.row.delete contains the delete action -->
          <q-td :props="props">
            <q-btn flat round color="primary" icon="visibility" @click="handleView(props.row)" />
          </q-td>
        </template>

        <template v-if="!$q.platform.is.mobile" v-slot:body-cell-delete="props">
          <q-td :props="props">
            <q-btn flat round color="red" icon="delete" @click="handleDelete(props.row)" />
          </q-td>
        </template>

        <template v-if="$q.platform.is.mobile" v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card flat bordered>
              <div style="display: flex; justify-content: flex-end;">
                <q-btn flat round color="red" icon="delete" @click="handleDelete(props.row)" />
              </div>
              <q-card-section class="text-left">

                <div class="row">
                  <span class="col-12  text-weight-bolder   ">
                    Supplier Name
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
    <div class="row justify-center q-my-sm ">
      <q-btn class="col-6" push color="primary" v-if="saveChanges" @click="onApply()">
        Save
      </q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { date, useQuasar, extend, is } from 'quasar';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ENV from "src/helpers/globals";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { customTableSearch } from "src/helpers/utils";
import DialogComponent from 'src/components/DialogComponent.vue';
import PurchaseInvoice from './PurchaseInvoice.vue';

const test = ref(0)

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;
const $q = useQuasar();

const change = (row) => {
  const item = rowsInvoice.value.find((val) => val.id === row.id);
  if (item.state == 0) { item.state = "1"; }
  else item.state = "0";

}

//date variables
const dateValidation = v => v === '____-__-__' ||
  v === '' || (date.isValid(v)) || 'Please Enter A Valid Date';
const invoiceStrDate = ref("");
const invoiceEndDate = ref("");


const rowsInvoice = ref([

])

let origRowInoice = ref([]);
//columns
const visibleCols = ['name', 'date', 'update', 'view', 'delete', 'arrived']
const columns = [
  {
    name: 'id',
    field: 'id'
  },
  {
    name: 'date',
    field: 'date',
    label: 'Invoice Date',
    align: 'left'
  },
  {
    name: "name",
    label: "Supplier Name",
    field: "name",
    align: "left",
  },

  { name: "update", label: "Update", field: null, align: "center", },
  { name: "view", label: "View", field: null, align: "center" },
  { name: "delete", label: "Delete", field: null, align: "center" },
  { name: "arrived", label: "Arrived", field: null, align: 'center' }
];

//search bar
const fltr_text = ref("");
const show_filter = ref(false);

//computed
const filteredData = computed(() => {
  if (fltr_text.value === '') {
    return cloneDeep(rowsInvoice.value)
  }
  else {
    return customTableSearch(fltr_text.value, rowsInvoice.value)
  }
})



const fetchData = async () => {
  try {
    setIsLoading(true);

    let uri = `${ENV.HomeURL}/invoice/getinvoices`

    if (invoiceStrDate.value) {
      uri += `?strD=${encodeURIComponent(invoiceStrDate.value)}`
    }
    else {
      uri += `?blablabla=''`
    }
    if (invoiceEndDate.value) {
      uri += `&endD=${encodeURIComponent(invoiceEndDate.value)}`
    }
    else {
      uri += `&blablabla=''`
    }
    uri += `&type='P'`
    console.log(uri)


    let resp = await fetch(uri, { method: 'get', headers: { 'Accept': 'application/json' } });

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
      rowsInvoice.value = resp;
      origRowInoice.value = extend(true, [], rowsInvoice.value)
    }


  }
  catch (err) {
    console.log(err);
  }
  finally {
    setIsLoading(false);
  }

}




const handleUpdate = (row) => {
  $q.dialog({
    component: DialogComponent,
    componentProps: {
      componentToRender: PurchaseInvoice, componentToRenderProps: {
        invid: row.id,
        mode: 'edit'
      }, persistant: true
    },
    ok: false, cancel: false

  }).onOk(data => {
    fetchData()

  }).onCancel(() => {
    console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

const handleView = (row) => {
  $q.dialog({
    component: DialogComponent,
    componentProps: {
      componentToRender: PurchaseInvoice, componentToRenderProps: {
        invid: row.id,
        mode: 'view'
      }, persistant: true
    },
    ok: false, cancel: false

  }).onOk(data => {
    fetchData()

  }).onCancel(() => {
    console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

const handleDelete = (row) => {
  console.log(row.state);
  $q.dialog({
    title: 'confirm',
    message: 'are you sure you want to delete this invoice',
    cancel: true
  }).onOk(() => {
    deleteInvoice(row.id)
  }).onCancel(() => {
    console.log('cancel');
  })
}

const deleteInvoice = async (rowId) => {
  try {

    const data = {
      id: rowId,
      type: 'P'
    }
    setIsLoading(true);
    let uri = `${ENV.HomeURL}/invoice/deleteInvoice`
    let resp = await fetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!resp.ok) {
      resp = await resp.text;
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: resp
      })
    } else {
      $q.notify({
        color: 'positive',
        type: 'positive',
        textColor: 'white',
        message: 'Invoice Deleted Successfull'
      })
      fetchData();
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
}


const updateHeader = async (id, state) => {
  try {
    console.log('test');
    const data = {
      Hid: id,
      Hstate: state,
    }

    setIsLoading(true);

    let uri = `${ENV.HomeURL}/invoice/UpdateHeader`;
    let resp = await fetch(uri, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!resp.ok) {
      resp = await resp.text;
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        message: resp
      })
    } else {
      $q.notify({
        color: 'positive',
        type: 'positive',
        textColor: 'white',
        message: 'Invoice Updated Successfull'
      })

    }
  } catch (ex) {
    console.log(ex);
  } finally {
    setIsLoading(false)
  }
}
const onApply = async () => {
  for (let i = 0; i < rowsInvoice.value.length; i++) {
    if (!is.deepEqual(origRowInoice.value[i], rowsInvoice.value[i])) {
      await updateHeader(rowsInvoice.value[i].id, rowsInvoice.value[i].state);
      rowsInvoice.value = rowsInvoice.value.filter((value) => value.id !== rowsInvoice.value[i].id)
    }
  }
  clone();
}

const clone = () => {
  origRowInoice.value = extend(true, [], rowsInvoice.value);
}

const saveChanges = computed(() => {
  return !is.deepEqual(origRowInoice.value, rowsInvoice.value)
})
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
