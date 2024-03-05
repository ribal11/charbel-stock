<template>
  <q-card class="q-ma-sm">
    <q-btn flat icon="close" style="float:right;z-index: 9999;" @click="router.go(-1)" />
    <loading-component v-if="isLoading" />
    <q-card-section>
      <div class="text-h6">Update Stock Item</div>
    </q-card-section>
    <q-card-section>
      <label for="sn">Serial No</label>
      <q-input square outlined v-model="item.serno" id="sn" />
      <label for="cat">Category</label>
      <q-input square outlined v-model="item.category" id="cat" />

      <label for="name">Name</label>
      <q-input square outlined v-model="item.name" id="name" />

      <label for="qty">Quantity</label>
      <q-input square outlined v-model="item.qty" id="qty" type="number" min="0" />

      <label for="3Month">3 Month Sale</label>
      <q-input square outlined v-model="item.threeMonthSale" id="3Month" />
      <label for="6Month">6 Month Sale</label>
      <q-input square outlined v-model="item.sixmonthSale" id="6Month" />
      <label for="year">Year Sale</label>
      <q-input square id="year" outlined v-model="item.YearSale" />
      <label for="3Min">Min stock 3 Months</label>
      <q-input square id="3Min" outlined v-model="item.minThreeMonth" />
      <label for="6Min">Min stock 6 Months</label>
      <q-input square id="6Min" outlined v-model="item.minSixMonth" />
      <label for="minYear">Min stock year</label>
      <q-input square id="minYear" outlined v-model="item.minYear" />
    </q-card-section>
    <q-card-actions>
      <q-btn class="btn-fixed-width label" color="primary" style="width: 100%" label="Update" @click="updateItem" />
    </q-card-actions>

  </q-card>
</template>

<script setup>
import { defineProps, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useStore } from "src/stores/store";
import ENV from "src/helpers/globals";
import LoadingComponent from "src/components/LoadingComponent.vue";

const $q = useQuasar()
const router = useRouter();
const $route = useRoute();
const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;



const item = ref({
  id: "",
  serno: "",
  category: "",
  name: "",
  qty: "",
  threeMonthSale: 0,
  sixmonthSale: 0,
  YearSale: 0,
  minThreeMonth: '',
  minSixMonth: "",
  minYear: "",
});


onMounted(() => {
  // console.log()
  fetchData();
})

const fetchData = async () => {
  try {
    setIsLoading(true);

    let resp = await fetch(`${ENV.HomeURL}/items/getItems?itemid=${$route.params.id}`, { method: 'get', headers: { 'Accept': 'application/json' } });

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
      if (resp.length > 0) {
        console.log('here')
        item.value.id = resp[0].id;
        item.value.serno = resp[0].serno;
        item.value.category = resp[0].cat;
        item.value.name = resp[0].name;
        item.value.qty = resp[0].qty;
        item.value.threeMonthSale = resp[0].threeMonth;
        item.value.sixmonthSale = resp[0].sixMonth;
        item.value.YearSale = resp[0].year;
        item.value.minThreeMonth = resp[0].minThree;
        item.value.minSixMonth = resp[0].minSix;
        item.value.minYear = resp[0].minYear;
        console.log(item.value.sixMonthSale);
      }

      // rows.value = resp;
    }


  }
  catch (err) {
    console.log(err);
  }
  finally {
    setIsLoading(false);
  }
}


const updateItem = async () => {
  try {

    if (!item.value.serno) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Serial Number is Missing",
      });
      return

    }
    else if (!item.value.category) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Category is Missing",
      });
      return
    }
    else if (!item.value.name) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Name is Missing",
      });
      return
    }
    else if (!item.value.qty) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Quantity is Missing",
      });
      return
    }
    else if (!item.value.threeMonthSale) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "three month sale is missing",
      });
      return
    } else if (!item.value.sixmonthSale) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "six month sale is missing",
      });
      return
    } else if (!item.value.YearSale) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "year slae is missing",
      });
      return
    }
    else if (!item.value.minSixMonth) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "minimum 6 month qty is missing",
      });
      return
    } else if (!item.value.minYear) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "minimum year qty is missing",
      });
      return
    }

    console.log(item.value.sixmonthSale);
    const body = {
      "id": item.value.id,
      "serialno": item.value.serno,
      "category": item.value.category,
      "description": item.value.name,
      "quantity": item.value.qty,
      "supplier": item.value.supplier,
      "threeMonthSale": item.value.threeMonthSale,
      "sixMonthSale": item.value.sixmonthSale,
      "yearSale": item.value.YearSale,
      "minSixMonth": item.value.minSixMonth,
      "minThreeMonth": item.value.minThreeMonth,
      "minYear": item.value.minYear
    }
    setIsLoading(true)
    let uri = `${ENV.HomeURL}/items/updateItem`;

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
      setTimeout(() => {
        router.push('/home');
      }, 1200);

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



watch(() => item.value.qty, (newQty, oldQty) => {
  if (Number(newQty) < 0 || isNaN(newQty)) {
    item.value.qty = 0;
  }
})
</script>

<style scoped>
label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.input {
  display: block;
  min-width: 400px;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
  font-size: 1rem;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}
</style>
