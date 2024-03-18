<template>
  <LoadingComponent v-if="isLoading" />


  <div class="row justify-around">

    <div class="col-6  q-pl-xs text-left align-middle" style="position: relative;">
      <q-btn-dropdown color="primary" label="Filter" style="position:absolute; top:50%;transform: translateY(-50%);">
        <q-list>
          <q-item clickable v-close-popup @click="filterClicked">
            <q-item-section>
              <q-item-label>Quantity</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-btn-dropdown>

    </div>
    <div class="col-6  text-right">
      <q-btn color="primary" label="Add New Item" class="q-my-sm q-mr-sm" @click="addItem" />
    </div>

  </div>



  <div>
    <q-chip removable v-model="showfilterchip" @remove="qtyfilter = null" color="primary" text-color="white"
      icon="filter_alt">
      {{ `Quantity < ${qtyfilter}` }} </q-chip>
  </div>

  <q-table class="table" style="height: 820px" flat bordered title="Stock" :rows="filteredData" :columns="columns"
    row-key="index" :rows-per-page-options="[0]" :visible-columns="visibleCols" :grid="$q.platform.is.mobile"
    binary-state-sort virtual-scroll v-model:pagination="pagination" auto-width>

    <template v-slot:top-right>
      <q-input v-if="show_filter" filled borderless dense debounce="300" v-model="fltr_text" placeholder="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn class="q-ml-sm" icon="filter_list" @click="show_filter = !show_filter" flat />
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-name="props">
      <q-td :props="props">
        {{ props.row.name }}

      </q-td>
    </template>

    <template v-slot:body-cell-cat="props">
      <q-td :props="props">
        {{ getCategory(props.row) }}
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-qty="props">
      <q-td :props="props">
        <q-btn flat icon-right="edit" color="primary" @click="$ev => editQty(props.row)" :label="props.row.qty"
          class="q-pa-none" />
      </q-td>
    </template>



    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-minThree="props">
      <q-td :props="props">
        {{ threeMonthVal(props.row) }}
      </q-td>

    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-minSix="props">
      <q-td :props="props">
        {{ sixMonthVal(props.row) }}
      </q-td>

    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-minYear="props">
      <q-td :props="props">
        {{ minYearVal(props.row) }}
      </q-td>

    </template>

    <template v-slot:body-cell-status="props">
      <q-td :props="props"
        :style="{ backgroundColor: status(props.row) == 'critical stock!' ? 'red' : status(props.row) == 'place an order' ? 'yellow' : 'white' }">
        {{ status(props.row) }}
      </q-td>
    </template>
    <template v-slot:body-cell-moq="props">
      <q-td :props="props">
        <q-btn flat icon-right="edit" color="primary" @click="$ev => editMoq(props.row)" :label="props.row.moq"
          style="width: 50px;" class="q-pa-none" />

      </q-td>
    </template>
    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-allowEdit=props>
      <q-td :props="props">
        <q-checkbox v-model="props.row.allowChange" true-value="1" false-value="0" @click="change(props.row)" />
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-update="props">

      <q-td :props="props">
        <q-btn flat round color="primary" icon="edit" @click="handleUpdate(props.row)"
          :disable="props.row.allowChange == 0" />
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-delete="props">

      <q-td :props="props">
        <q-btn flat round color="primary" icon="delete" @click="handleDelete(props.row)" />
      </q-td>
    </template>

  </q-table>

</template>

<script setup>

import { computed, onMounted, ref, watch } from "vue";
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

const show_filter = ref(false);
const fltr_text = ref('');

const pagination = ref({
  rowsPerPage: 1000,
});

const visibleCols = ['serno', 'cat', 'name', 'qty', 'supp', 'order', 'reserve', 'threeMonth', 'sixMonth', 'year', 'minThree', 'minSix', 'minYear', 'status', 'moq', 'allowEdit', 'update', 'delete']
const columns = [
  {
    name: 'id',
    field: 'id',
    sortable: true
  },

  {
    name: "serno",
    align: "center",
    label: "Item Serial Number",
    field: "serno",
    sortable: true
  },
  {
    name: "cat",
    label: "Item Category",
    field: "cat",
    align: "center",
    sortable: true
  },
  {
    name: "name",
    label: "Item Name",
    field: "name",
    align: "left",
    sortable: true
  },
  { name: "qty", label: "Item Qty", field: "qty", align: "center", sortable: true },

  {
    name: "order",
    label: "order qty",
    field: "order",
    align: "center"
  },
  {
    name: "reserve",
    label: "reserve qty",
    field: "reserve",
    align: "center"
  },
  {
    name: "threeMonth",
    label: "3 Month sale",
    field: "threeMonth",
    align: "center"
  },
  {
    name: "sixMonth",
    label: "6 Month sale",
    field: "sixMonth",
    align: "center"
  },
  {
    name: "year",
    label: "year sale",
    field: "year",
    align: "center"
  },
  {
    name: "minThree",
    label: "min stock 3 month",
    field: "minThree",
    align: "center"
  },
  {
    name: "minSix",
    label: "min stock 6 month",
    field: "minSix",
    align: "center"
  },
  {
    name: "minYear",
    label: "min stock year",
    field: "minYear",
    align: "center"
  },
  {
    name: "status",
    label: "status",
    field: "status",
    align: "center",
    sortable: true,
  },
  {
    name: "moq",
    label: "moq",
    field: "moq",
    align: "center"
  },
  { name: 'allowEdit', label: "allow change", field: null, align: "center" },
  { name: "update", label: "updateMin", field: null, align: "center", },
  { name: "delete", label: "delete", field: null, align: "center" },
];

const rows = ref([]);
const qtyfilter = ref(null);
const showfilterchip = ref(false)

watch(() => qtyfilter.value, (newV, oldV) => {
  if (newV !== null)
    showfilterchip.value = true;
  fetchData()
})

const filterClicked = () => {
  $q.dialog({
    title: 'Quantity Less Than',
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: qtyfilter.value,
      type: 'number',

      // native attributes:
      min: 1,
      step: 1
    },
    cancel: true,
    persistent: true
  }).onOk(data => {
    qtyfilter.value = data;


  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

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

const change = async (row) => {
  const item = rows.value.find((val) => val.id === row.id);
  console.log(item.allowChange);
  if (item.allowChange == 0) { item.allowChange = "1"; }
  else item.allowChange = "0";

  await updateItem(row);
  item.minThree = item.threeMonth + (item.threeMonth / 90 * 14)
  item.minSix = item.sixMonth + (item.sixMonth / 180 * 14)
  item.minYear = item.year + (item.year / 360 * 14)
}

const threeMonthVal = (item) => {

  if (item.allowChange == 0) {
    const formula = item.threeMonth + (item.threeMonth / 90 * 14)
    item.minThree = formula;
    return formula
  } else {
    return item.minThree;
  }
}

const sixMonthVal = (item) => {
  const formula = item.sixMonth + (item.sixMonth / 180 * 14);
  if (item.allowChange == 0) {
    item.minSix = formula;
    return formula
  } else {
    return item.minSix;
  }
}

const minYearVal = (item) => {
  const formula = item.year + (item.year / 360 * 14)
  if (item.allowChange == 0) {
    item.minYear = formula;
    return formula
  } else {
    return item.minYear;
  }
}

const status = (item) => {
  const formula = item.qty + item.order - item.reserve / item.threeMonth;
  if (formula <= 3) {
    return 'critical stock!'
  } else if (formula <= 4) {
    return 'place an order'
  } else {
    return 'stock are sufficient'
  }
}

const getCategory = (item) => {
  const index = item.serno.indexOf('-');
  const code = item.serno.substring(0, index).toUpperCase()
  switch (code) {
    case 'C099': return 'Miscellaneous'
    case 'C903': return 'Arcos light'
    case 'C904': return 'SLV Elekt. Gmbh'
    case 'C906': return 'COOPER Luminaires'
    case 'C907': return 'DISANO Luminaires'
    case 'C860': return 'Batten'
    case 'C870': return 'TL.  LUMINAIRES'
    case 'C570': return 'LED Luminaires Factory'
    case 'C905': return 'LENA Luminaires'
    case 'C770': return 'LIT-LED Drivers&Emerg.Bat'
    case 'C793': return 'LIT-Smart Switch'
    case 'C794': return 'LIT-Con.Cab.For T5Led Bat'
    case 'C701': return 'LIT-LED Lamps MR16'
    case 'C704': return 'LIT-LED PL L Lamps'
    case 'C700': return 'LIT-T LED Lamps'
    case 'C707': return 'LIT-LED E27&B22 bulb'
    case 'C705': return 'LIT-LED filament bulb'
    case 'C708': return 'LIT-LED Candle & Lustre'
    case 'C709': return 'LIT-LED G9'
    case 'C703': return 'LIT-LED Aluminium Profile'
    case 'C760': return 'LIT-LED Decorative Spots'
    case 'C710': return 'LIT-LED Floodlight Lumina'
    case 'C730': return 'LIT-LED Indoor Luminaires'
    case 'C702': return 'LIT-LED Strip'
    case 'C750': return 'LIT-LED Waterproof Lumina'
    case 'C711': return 'LIT-LED high bay'
    case 'C731': return 'LIT-LED Indoor surface'
    case 'C790': return 'LIT-LED Divers'
    case 'C733': return 'LIT-LED Plafonnier'
    case 'C734': return 'LIT-LED Slim Downlight'
    case 'C791': return 'LIT-Street Lights Solar'
    case 'C792': return 'LIT-Flood Lights Solar'
    case 'C951': return 'OPPLE-LED T5 batten'
    case 'C952': return 'OPPLE-LED Downlight'
    case 'C956': return 'OPPLE-LED Luminaires'
    case 'C960': return 'OPPLE-LED Floodlt Lumi'
    case 'C946': return 'OPPLE-LED Decorat.Lumin'
    case 'C947': return 'OPPLE-LED Track Lumin.'
    case 'C948': return 'OPPLE-LEDHighbay Luminair'
    case 'C949': return 'OPPLE-LEDWaterproof Lumin'
    case 'C965': return 'OPPLE-LED Street Lighting'
    case 'C966': return 'OPPLE-LED SENSOR&DRIVER'
    case 'C955': return 'OPPLE-LED filament'
    case 'C957': return 'OPPLE-LED T8'
    case 'C950': return 'OPPLE-LED strip'
    case 'C954': return 'OPPLE-LED-Bulb'
    case 'C953': return 'OPPLE-LED PLAFONNIER'
    case 'C958': return 'OPPLE-LED Candle'
    case 'C959': return 'OPPLE-LED Dichroic'
    case 'C804': return 'CD-M Electronic Ballast'
    case 'C800': return 'Electronic Ballast'
    case 'C150': return 'Outdoor Ballasts'
    case 'C805': return 'PL Lamps Ballast'
    case 'C801': return 'Standard Ballast'
    case 'C402': return 'STARTERS'
    case 'C803': return 'TL-D / HF-R Electronic Ba'
    case 'C802': return 'TL 5 Electronic Ballast'
    case 'C304': return 'CD-M Lamps'
    case 'C404': return 'CFL-i Lamps'
    case 'C405': return 'CFL-ni Lamps/PL-C'
    case 'C409': return 'EcoHome Lamps'
    case 'C408': return 'Essential TL-5 Lamps'
    case 'C400': return 'Fluorescent Lamps'
    case 'C063': return 'LustreP45 & FlammeB35 Lam'
    case 'C300': return 'Mercury+Sodium Lamps'
    case 'C301': return 'Special Lamps'
    case 'C403': return 'TL-5 Lamps'
    case 'C406': return 'Tornado Lamps'
    case 'C416': return 'Tornado T2 Lamps'
    case 'C306': return 'TUV Lamps'
    case 'C411': return 'CFL-ni Lamps/PL-L'
    case 'C412': return 'CFL-ni Lamps/PL-T'
    case 'C507': return 'LED-Floodlights Outdoor'
    case 'C506': return 'LED-Industrial Luminaires'
    case 'C503': return 'LED-Outdoor Luminaires Sa'
    case 'C509': return 'LED-P45 & Flammes B35 Lam'
    case 'C508': return 'LED - Battens'
    case 'C511': return 'LED - Bulb'
    case 'C514': return 'LED - PLC Lamps'
    case 'C510': return 'LED - T LED'
    case 'C512': return 'LED -T LED T5'
    case 'C504': return 'LED Lamps-Retail'
    case 'C502': return 'LED Lamp modul drive'
    case 'C500': return 'SPOT Luminaires'
    case 'C501': return 'LED Spots'
    case 'C601': return 'Lighting Control'
    case 'C513': return 'Customized LED Luminaire'
    case 'C515': return 'LED PANELS'
    case 'C861': return 'Imported Battens'
    case 'C164': return 'Industrial Luminaires'
    case 'C161': return 'Outdoor Projectors'
    case 'C261': return 'Outdoor Projectors'
    case 'C811': return 'SPOTS'
    case 'C160': return 'Street Lighting Lumi'
    case 'C260': return 'Street Lighting Lumi'
    case 'C821': return 'Waterproof Luminaire'
    case 'C822': return 'Waterproof Luminaire'
    case 'C970': return 'TRIDONIC EMconverterLed'
    case 'C910': return 'NORTHCLIFFE LUMINAIRE'
    case 'C920': return 'BES-A LUMINAIRE'
    case 'C922': return 'LUMIVEN LUMINAIRE'
    case 'C923': return 'LUMIVEN DRIVER'
    case 'C939': return 'LUXIONA DRIVER'
    case 'C1002': return 'PELSAN LED PANEL'
    case 'C1003': return 'PELSAN EMERG.BATT'
    case 'C1004': return 'PELSAN WATERPROOF LUMIN'
    case 'C1005': return 'PELSAN PLAFONNIER'
    case 'C1010': return 'PELSAN OUTDOOR BALLASTS'
    case 'C1015': return 'PELSAN OUTDOOR LIGHTING.'
    case 'C1200': return 'SOLAR PV PANEL'
    case 'C1070': return 'JISO LIGHTING LED'
    case 'C1080': return 'CLAMPCO OBST.LIGHT'
    case 'C516': return 'Led Plafonnier'
    default: return 'no category'
  }

}

const uploadExcelFile = async (files) => {

  try {
    setIsLoading(true)
    let file = files[0];

    const formData = new FormData('file', file);
    response = await fetch(`${ENV.HomeURL}/items/putNewData`, {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })


    if (!response.ok) {
      response = await response.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    } else {
      await fetchData();
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
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
  }).onOk(async (data) => {


    const item = rows.value.find((val) => val.id === row.id)
    item.qty = Number(data);
    await updateReserve(item.id, item.qty, 'qty')

    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

const editMoq = (row) => {
  $q.dialog({
    title: 'Input Quantity',
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: row.moq,
      type: 'number',

      // native attributes:
      min: 1,
      step: 1
    },
    cancel: true,
    persistent: true
  }).onOk(async (data) => {


    const item = rows.value.find((val) => val.id === row.id)
    item.moq = Number(data);
    await updateReserve(item.id, item.moq, 'moq');

    // console.log('>>>> OK, received', data)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

onMounted(() => {
  fetchData();
})
const fetchData = async () => {
  try {
    setIsLoading(true);

    let resp = await fetch(`${ENV.HomeURL}/items/getItems${qtyfilter.value !== null ? '?minqty=' + qtyfilter.value : ''}`, { method: 'get', headers: { 'Accept': 'application/json' } });

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

const updateItem = async (item) => {
  try {
    setIsLoading(true)
    const body = {
      "id": item.id,
      'allow': item.allowChange,
      'val3': item.minThree,
      'val6': item.minThree,
      'valY': item.minYear
    }

    let uri = `${ENV.HomeURL}/items/allowUpdate`;

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
        message: "Item Updated Successfully",
        timeout: 2000
      });

      // resp = await resp.text();
      // console.log(resp)


    }


  }
  catch (error) {
    console.log(error)
  }
  finally {
    setIsLoading(false)
  }
}

const updateReserve = async (id, quantity, type) => {
  try {
    setIsLoading(true);
    const data = {
      id: id,
      attr: quantity,
      type: type
    }

    let uri = `${ENV.HomeURL}/item/updateQuantity`

    let response = await fetch(uri, {
      method: "post",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      let resp = await response.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp
      })
    } else {
      console.log('r');
    }
  } catch (err) { console.log(err); } finally {
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
