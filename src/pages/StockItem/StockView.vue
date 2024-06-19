<template>
  <LoadingComponent v-if="isLoading" />

  <div class="row justify-around">
    <div class="col q-pl-xs text-left align-middle" style="position: relative">
      <q-btn-dropdown
        color="primary"
        label="Filter"
        style="position: absolute; top: 50%; transform: translateY(-50%)"
      >
        <q-list>
          <q-item clickable v-close-popup @click="filterClicked">
            <q-item-section>
              <q-item-label>Quantity</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="col text-center">
      <q-btn
        color="primary"
        label="export as excel"
        class="q-my-sm q-mr-sm"
        @click="transformExcel()"
      />
    </div>
    <div class="col text-right">
      <q-btn
        color="primary"
        label="Add New Item"
        class="q-my-sm q-mr-sm"
        @click="addItem"
      />
    </div>
  </div>

  <div>
    <q-chip
      removable
      v-model="showfilterchip"
      @remove="qtyfilter = null"
      color="primary"
      text-color="white"
      icon="filter_alt"
    >
      {{ `Quantity < ${qtyfilter}` }}
    </q-chip>
  </div>

  <q-table
    class="sticky-header"
    :style="{ height: `${0.89 * $q.screen.height}px` }"
    flat
    bordered
    title="Stock"
    :rows="filteredData"
    :columns="columns"
    row-key="index"
    :rows-per-page-options="[0]"
    :visible-columns="visibleCols"
    :grid="$q.platform.is.mobile"
    binary-state-sort
    virtual-scroll
    v-model:pagination="pagination"
  >
    <template v-slot:top-right>
      <q-input
        v-if="show_filter"
        filled
        borderless
        dense
        debounce="300"
        v-model="fltr_text"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
      <q-btn
        class="q-ml-sm"
        icon="filter_list"
        @click="show_filter = !show_filter"
        flat
      />
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
        <q-btn
          flat
          icon-right="edit"
          color="primary"
          @click="($ev) => editQty(props.row)"
          :label="props.row.qty"
          class="q-pa-none"
        />
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
      <q-td
        :props="props"
        :style="{
          backgroundColor:
            status(props.row) == 'critical stock!'
              ? 'red'
              : status(props.row) == 'place an order'
              ? 'yellow'
              : 'white',
        }"
      >
        {{ status(props.row) }}
      </q-td>
    </template>
    <template v-slot:body-cell-moq="props">
      <q-td :props="props">
        <q-btn
          flat
          icon-right="edit"
          color="primary"
          @click="($ev) => editMoq(props.row)"
          :label="props.row.moq"
          style="width: 50px"
          class="q-pa-none"
        />
      </q-td>
    </template>
    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-allowEdit="props">
      <q-td :props="props">
        <q-checkbox
          v-model="props.row.allowChange"
          true-value="1"
          false-value="0"
          @click="change(props.row)"
        />
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-update="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          color="primary"
          icon="edit"
          @click="handleUpdate(props.row)"
          :disable="props.row.allowChange == 0"
        />
      </q-td>
    </template>

    <template v-if="!$q.platform.is.mobile" v-slot:body-cell-delete="props">
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
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ENV from "src/helpers/globals";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";
import { cloneDeep } from "lodash";
import { customTableSearch, getCategory } from "src/helpers/utils";

const $q = useQuasar();
const router = useRouter();

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

const show_filter = ref(false);
const fltr_text = ref("");

const pagination = ref({
  rowsPerPage: 1000,
});

const visibleCols = [
  "serno",
  "cat",
  "name",
  "qty",
  "supp",
  "order",
  "reserve",
  "threeMonth",
  "sixMonth",
  "year",
  "minThree",
  "minSix",
  "minYear",
  "status",
  "moq",
  "allowEdit",
  "update",
  "delete",
];
const columns = [
  {
    name: "id",
    field: "id",
    sortable: true,
  },

  {
    name: "serno",
    align: "center",
    label: "Item Serial Number",
    field: "serno",
    sortable: true,
  },
  {
    name: "cat",
    label: "Item Category",
    field: "cat",
    align: "center",
    sortable: true,
  },
  {
    name: "name",
    label: "Item Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "qty",
    label: "Item Qty",
    field: "qty",
    align: "center",
    sortable: true,
  },

  {
    name: "order",
    label: "order qty",
    field: "order",
    align: "center",
  },
  {
    name: "reserve",
    label: "reserve qty",
    field: "reserve",
    align: "center",
  },
  {
    name: "threeMonth",
    label: "3 Month sale",
    field: "threeMonth",
    align: "center",
  },
  {
    name: "sixMonth",
    label: "6 Month sale",
    field: "sixMonth",
    align: "center",
  },
  {
    name: "year",
    label: "year sale",
    field: "year",
    align: "center",
  },
  {
    name: "minThree",
    label: "min stock 3 month",
    field: "minThree",
    align: "center",
  },
  {
    name: "minSix",
    label: "min stock 6 month",
    field: "minSix",
    align: "center",
  },
  {
    name: "minYear",
    label: "min stock year",
    field: "minYear",
    align: "center",
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
    align: "center",
  },
  { name: "allowEdit", label: "allow change", field: null, align: "center" },
  { name: "update", label: "updateMin", field: null, align: "center" },
  { name: "delete", label: "delete", field: null, align: "center" },
];

const rows = ref([]);
const qtyfilter = ref(null);
const showfilterchip = ref(false);

watch(
  () => qtyfilter.value,
  (newV, oldV) => {
    if (newV !== null) showfilterchip.value = true;
    fetchData();
  }
);

const filterClicked = () => {
  $q.dialog({
    title: "Quantity Less Than",
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: qtyfilter.value,
      type: "number",

      // native attributes:
      min: 1,
      step: 1,
    },
    cancel: true,
    persistent: true,
  })
    .onOk((data) => {
      qtyfilter.value = data;
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

function handleDelete(row) {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this stock Item?",
    cancel: true,
  })
    .onOk(() => {
      // rows.value = rows.value.filter((item) => item.ItemSerialNumber !== row.ItemSerialNumber)
      deleteItem(row.id);
    })
    .onCancel(() => {
      console.log("cancel");
    });
}

function handleUpdate(row) {
  router.push(`/home/edit/${row.id}`);
}
function addItem() {
  router.push("/home/add");
}

const getCols = computed(() => {
  const filteredColumns = columns.filter(
    (col) => col.name !== "update" && col.name !== "delete" && col.name !== "id"
  );
  return filteredColumns;
});

const change = async (row) => {
  const item = rows.value.find((val) => val.id === row.id);
  console.log(item.allowChange);
  if (item.allowChange == 0) {
    item.allowChange = "1";
  } else item.allowChange = "0";

  await updateItem(row);
  item.minThree = item.threeMonth + (item.threeMonth / 90) * 14;
  item.minSix = item.sixMonth + (item.sixMonth / 180) * 14;
  item.minYear = item.year + (item.year / 360) * 14;
};

const threeMonthVal = (item) => {
  if (item.allowChange == 0) {
    const formula = item.threeMonth + (item.threeMonth / 90) * 14;
    item.minThree = formula;
    return formula;
  } else {
    return item.minThree;
  }
};

const sixMonthVal = (item) => {
  const formula = item.sixMonth + (item.sixMonth / 180) * 14;
  if (item.allowChange == 0) {
    item.minSix = formula;
    return formula;
  } else {
    return item.minSix;
  }
};

const minYearVal = (item) => {
  const formula = item.year + (item.year / 360) * 14;
  if (item.allowChange == 0) {
    item.minYear = formula;
    return formula;
  } else {
    return item.minYear;
  }
};

const status = (item) => {
  const formula = (item.qty + item.order - item.reserve) / item.sixMonth;
  const formula2 = (item.qty + item.order - item.reserve) / item.threeMonth;
  const formula3 = item.threeMonth / item.sixMonth;

 if (formula3 <= 0.55) {
    if (formula <= 0.75) {
      return "critical stock!"
    } else if ( formula <= 1) {
      return "place an order"
    } else {
      return "stock is sufficient"
    }
  } else {
    if (formula2 <= 1.5) {
      return "critical stock!"
    } else if ( formula2 <= 2) {
      return "place an order"
    } else {
      return "stock is sufficient"
    }
  }
  
};

const uploadExcelFile = async (files) => {
  try {
    setIsLoading(true);
    let file = files[0];

    const formData = new FormData("file", file);
    response = await fetch(`${ENV.HomeURL}/items/putNewData`, {
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

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
};

const editQty = (row) => {
  $q.dialog({
    title: "Input Quantity",
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: row.qty,
      type: "number",

      // native attributes:
      min: 1,
      step: 1,
    },
    cancel: true,
    persistent: true,
  })
    .onOk(async (data) => {
      const item = rows.value.find((val) => val.id === row.id);
      item.qty = Number(data);
      await updateReserve(item.id, item.qty, "qty");

      // console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const editMoq = (row) => {
  $q.dialog({
    title: "Input Quantity",
    // message: 'Please type a value between 0 and 10:',
    prompt: {
      model: row.moq,
      type: "number",

      // native attributes:
      min: 1,
      step: 1,
    },
    cancel: true,
    persistent: true,
  })
    .onOk(async (data) => {
      const item = rows.value.find((val) => val.id === row.id);
      item.moq = Number(data);
      await updateReserve(item.id, item.moq, "moq");

      // console.log('>>>> OK, received', data)
    })
    .onCancel(() => {
      // console.log('>>>> Cancel')
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

onMounted(() => {
  fetchData();
});
const fetchData = async () => {
  try {
    setIsLoading(true);

    let resp = await fetch(
      `${ENV.HomeURL}/items/getItems${
        qtyfilter.value !== null ? "?minqty=" + qtyfilter.value : ""
      }`,
      { method: "get", headers: { Accept: "application/json" } }
    );

    if (!resp.ok) {
      resp = await resp.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    } else {
      resp = await resp.json();
      rows.value = resp;
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
};

const deleteItem = async (itemid) => {
  try {
    setIsLoading(true);

    let resp = await fetch(`${ENV.HomeURL}/items/deleteItem?id=${itemid}`, {
      method: "get",
      headers: { Accept: "application/json" },
    });

    if (!resp.ok) {
      resp = await resp.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    } else {
      // resp = await resp.json();
      $q.notify({
        color: "positive",
        type: "positive",
        textColor: "white",
        message: "Item Deleted Successfully",
        timeout: 2000,
      });
      fetchData();
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
};

const updateItem = async (item) => {
  try {
    setIsLoading(true);
    const body = {
      id: item.id,
      allow: item.allowChange,
      val3: item.minThree,
      val6: item.minThree,
      valY: item.minYear,
    };

    let uri = `${ENV.HomeURL}/items/allowUpdate`;

    let resp = await fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      resp = await resp.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    } else {
      $q.notify({
        color: "positive",
        type: "positive",
        textColor: "white",
        message: "Item Updated Successfully",
        timeout: 2000,
      });

      // resp = await resp.text();
      // console.log(resp)
    }
  } catch (error) {
    console.log(error);
  } finally {
    setIsLoading(false);
  }
};

const updateReserve = async (id, quantity, type) => {
  try {
    setIsLoading(true);
    const data = {
      id: id,
      attr: quantity,
      type: type,
    };

    let uri = `${ENV.HomeURL}/item/updateQuantity`;

    let response = await fetch(uri, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let resp = await response.text();
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: resp,
      });
    } else {
      console.log("r");
    }
  } catch (err) {
    console.log(err);
  } finally {
    setIsLoading(false);
  }
};
const filteredData = computed(() => {
  if (fltr_text.value === "") {
    return cloneDeep(rows.value);
  } else {
    return customTableSearch(fltr_text.value, rows.value);
  }
});

const transformExcel = () => {
  // Transform data to include additional properties
  const data = rows.value.map((val) => {
    const threeMonthData = val.threeMonth + (val.threeMonth / 90) * 14;
    const sixMonthData = val.sixMonth + (val.sixMonth / 180) * 14;
    const yearData = val.year + (val.year / 360) * 14;
    const stat = status(val);
    // Return object with additional properties
    return {
      item: val.serno,
      description: val.name,
      stock: val.qty,
      order: val.order,
      reserve: val.reserve,
      three_Month_Stock: val.threeMonth,
      six_Month_stock: val.sixMonth,
      year_stock: val.year,
      minthreeMonth: threeMonthData,
      minsixMonth: sixMonthData,
      minYear: yearData,
      status: stat,
    };
  });

  // Create worksheet from the transformed data
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  FileSaver.saveAs(excelBlob, "data.xlsx");
};

const downloadExcel = (buffer, fileName) => {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>

<style lang="sass">
.sticky-header
  /* height or max-height is important */
  max-height: 100vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
