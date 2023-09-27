<template>
  <LoadingComponent v-if="isLoading" />
  <q-card class="q-pa-md q-ma-sm">
    <div class="cardTitle cardTitleSticky">
      Sales Invoices
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

  </q-card>
</template>

<script setup>
import { date, useQuasar } from 'quasar';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ENV from "src/helpers/globals";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { customTableSearch } from "src/helpers/utils";
import DialogComponent from 'src/components/DialogComponent.vue';
import SalesInvoice from './SalesInvoice.vue';



const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;
const $q = useQuasar();


//date variables
const dateValidation = v => v === '____-__-__' ||
  v === '' || (date.isValid(v)) || 'Please Enter A Valid Date';
const invoiceStrDate = ref("");
const invoiceEndDate = ref("");


const rowsInvoice = ref([])
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
    align: 'left'
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
      componentToRender: SalesInvoice, componentToRenderProps: {
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
      componentToRender: SalesInvoice, componentToRenderProps: {
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
