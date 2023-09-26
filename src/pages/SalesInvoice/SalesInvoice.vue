//add edit here and create dd dialog for delete in index

<template>
  <q-card class="q-ma-sm">

    <div class="row justify-around">
      <div class="col-12 col-sm-4 q-ml-sm q-mt-md">
        <q-input outlined v-model="name" placeholder="Client name" />
      </div>
      <div class="col-12 col-sm-4 q-ml-sm  q-mt-md">
        <q-input filled ref="visitDateRef" v-model="invoiceDate" mask="####-##-##" label="Invoice Date">
          <template v-slot:append>
            <q-icon name=" event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="invoiceDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-2 q-ml-sm  q-mt-md">
        <q-btn color="primary" label="Add Item" class="q-mr-md" @click="addItem" />
      </div>
    </div>


    <q-table class="q-mt-md" style="height: auto" flat bordered :rows="dataRows" :columns="columns"
      :grid="$q.platform.is.mobile" row-key="index" virtual-scroll :rows-per-page-options="[0]">
      <!-- Custom "update" and "delete" columns -->


      <template v-slot:body-cell-qty="props">
        <!-- Assuming props.row.delete contains the delete action -->
        <q-td :props="props">
          <q-btn flat icon-right="edit" color="primary" @click="$ev => editQty(props.row)" :label="props.row.qty" />
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <!-- Assuming props.row.delete contains the delete action -->
        <q-td :props="props">
          <q-btn flat round color="primary" icon="delete" @click="$ev => handleDelete(props.row)" />
        </q-td>
      </template>

      <template v-if="$q.platform.is.mobile" v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
          <q-card flat bordered>
            <q-card-section class="text-left">
              <div style="float: right;">
                <q-btn flat round color="primary" icon="delete" @click="$ev => handleDelete(props.row)" />
              </div>
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
                  <q-btn flat icon-right="edit" color="primary" @click="$ev => editQty(props.row)"
                    :label="props.row.qty" />
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




    <div class="row justify-center q-my-sm ">
      <q-btn class="col-6" push color="primary" v-if="dataRows.length > 0" @click="onApply">
        Save
      </q-btn>
    </div>
  </q-card>
</template>

<script setup>
import { computed, ref, watch, onMounted, reactive } from "vue";
import { date, useDialogPluginComponent, useQuasar } from "quasar";
import { useRouter } from "vue-router";
import DialogComponent from "src/components/DialogComponent.vue";
import StockSearch from "../StockItem/StockSearch.vue";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import ENV from "src/helpers/globals";

//emits for the dialog
defineEmits([...useDialogPluginComponent.emits]);

const router = useRouter();
const { dialogRef, onDialogHide } = useDialogPluginComponent();

const $q = useQuasar();

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

//column of the table client items
const columns = [
  {
    name: "serno",
    align: "center",
    label: "Serial Number",
    field: "serno",
  },
  {
    name: "cat",
    label: "Category",
    field: "cat",
    align: "center",
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
  },
  { name: "qty", label: "Item Qty", field: "qty", align: "center" },
  {
    name: "supp",
    label: "Supplier",
    field: "supp",
    align: "center",
  },
  { name: "delete", label: "", field: "", align: "center" },

];

//items of the client
const dataRows = ref([]);

const name = ref("");


const invoiceDate = ref(null)


function addItem() {
  // if (dialogRef.value) {
  //   dialogRef.value.show();
  // }

  $q.dialog({
    component: DialogComponent,
    componentProps: {
      componentToRender: StockSearch, componentToRenderProps: {

      }, persistant: true
    },
    ok: false, cancel: false

  }).onOk(data => {
    console.log(data);
    let newItems = []

    data.forEach((dataObject) => {
      if (!dataRows.value.find(e => e.id === dataObject.id)) {
        newItems.push({ ...dataObject, qty: 1 });
      }
    });
    if (newItems.length > 0) {
      dataRows.value = dataRows.value.concat(newItems)
    }

  }).onCancel(() => {
    console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })

}



const editQty = (row) => {
  $q.dialog({
    title: 'Input Quantity',
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: row.qty,
      type: 'number',

      // native attributes:
      min: 1,
      step: 1
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    console.log(data)
    row.qty = data;
    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

const handleDelete = (row) => {
  $q.dialog({
    title: 'Do you want to delete this item?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    let idx = dataRows.value.findIndex(e => e.id === row.id);
    dataRows.value.splice(idx, 1);
  })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    }).onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    })
}

const onApply = async (e) => {
  try {

    if (!name.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Client Name Is Missing",
      });
      return

    }
    else if (!invoiceDate.value) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Date is Missing",
      });
      return
    }

    const body = {
      "client": name.value,
      "date": invoiceDate.value,
      "type": "S",
      "items": dataRows.value.map(e => {
        return {
          itemid: e.id,
          qty: e.qty
        }
      })


    }
    setIsLoading(true)
    let uri = `${ENV.HomeURL}/invoice/upsert`;

    let resp = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });


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
      $q.notify({
        color: "positive",
        type: 'positive',
        textColor: "white",
        message: "Item Added Successfully",
        timeout: 2000
      });
      name.value = ''
      invoiceDate.value = ''
      dataRows.value = []




    }


  }
  catch (error) {
    console.log(error)
  }
  finally {
    setIsLoading(false)
  }
}

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

/* .input {
  display: flex;
  justify-content: center;
  align-items: center;
} */

.card {
  width: auto;
}

.search {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-message {
  font-size: 2rem;
  /* Adjust the font size as needed */
  color: #888;
  /* Gray color */
  opacity: 0.5;
  /* Reduced opacity */
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
  height: 100vh;
  /* This centers content vertically */
}

p {
  margin: 0;
  padding: 0;
}

.label {
  display: block;
}
</style>
