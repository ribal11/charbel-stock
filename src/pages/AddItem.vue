<template>
  <q-card class="q-ma-sm">
    <q-btn flat icon="close" style="float:right;z-index: 9999;" @click="router.go(-1)" />

    <LoadingComponent v-if="isLoading" />
    <q-card-section>
      <div class="text-h6">Add Stock Item</div>
    </q-card-section>

    <q-card-section>
      <label for="id">Serial No</label>
      <q-input dense square outlined v-model="item.serno" />
      <label for="category">Category</label>
      <q-input dense square outlined v-model="item.category" />

      <label for="name">Name</label>
      <q-input dense square outlined v-model="item.name" />



      <label for="qty">Quantity</label>
      <q-input dense square outlined v-model="item.qty" type="number" min="0" />

      <label for="supp">Supplier</label>
      <q-input dense square outlined v-model="item.supplier" />
    </q-card-section>
    <q-card-actions>
      <q-btn color="primary" style="width: 100%" label="Update" @click="addItem" />
    </q-card-actions>


  </q-card>
</template>
<script setup>
import BaseCard from "src/components/UI/BaseCard.vue";
import { useRouter } from "vue-router";
import { onMounted, reactive, ref, watch } from "vue";
import { useQuasar } from "quasar";

import ENV from "src/helpers/globals";
import LoadingComponent from "src/components/LoadingComponent.vue";
import { useStore } from "src/stores/store";
import { storeToRefs } from "pinia";

const router = useRouter()
const $q = useQuasar()
const item = ref({
  serno: "",
  category: "",
  name: "",
  qty: "",
  supplier: "",
});

onMounted(() => {

})

const store = useStore();

const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;

const addItem = async () => {
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




// add the item in the db

// async function addForm(){
//   if(item.id == '' || item.category == '' || item.name == '' || item.qty == '' || item.supplier == ''){
//     $q.dialog({
//       title: "Alert",
//       message: "Please fill in all the fields.",
//     }).onOk(() => {
//       console.log("OK");
//     });
//   } else {
//     try{
//         const response = await fetch('https://localhost:3000/api/add',{
//             method:'post',
//             headers: { "Content-Type": "application/json" },
//             body:JSON.stringify(item),
//         })
//         if(response.ok){
//             router.push('/home');
//         } else {
//           const errorText = await response.text();
//           console.log(`Error: ${response.status} - ${errorText}`);
//         }
//     } catch(err){
//         console.log(err);
//     }
//   }
// }

watch(() => item.value.qty, (newQty, oldQty) => {
  if (Number(newQty) < 0 || isNaN(newQty)) {
    item.value.qty = 0;
  }
})
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

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

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
