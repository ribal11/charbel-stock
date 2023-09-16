<template>
  <q-card class="q-ma-sm">
    <q-card-section>
      <div class="text-h6">Update Stock Item</div>
    </q-card-section>
    <q-card-section>
      <label for="sn">Serial No</label>
      <q-input square outlined v-model="item.id" id="sn" />
      <label for="cat">Category</label>
      <q-input square outlined v-model="item.category" id="cat" />

      <label for="name">Name</label>
      <q-input square outlined v-model="item.name" id="name" />

      <label for="qty">Quantity</label>
      <q-input square outlined v-model="item.qty" id="qty" type="number" min="0" />

      <label for="supp">Supplier</label>
      <q-input square outlined v-model="item.supplier" id="supp" />
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

const $q = useQuasar()
const router = useRouter();
const $route = useRoute();
const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;



const item = ref({
  id: "",
  category: "",
  name: "",
  qty: 0,
  supplier: "",
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
      console.log(resp)
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
    else if (!item.value.supplier) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "warning",
        message: "Supplier is Missing",
      });
      return
    }


    const body = {
      "serialno": item.value.serno,
      "category": item.value.category,
      "description": item.value.name,
      "quantity": item.value.qty,
      "supplier": item.value.supplier

    }
    setIsLoading(true)
    let uri = `${ENV.HomeURL}/items/addItem`;

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
