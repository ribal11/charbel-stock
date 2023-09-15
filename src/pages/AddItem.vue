<template>
  <q-page class="container">
    <base-card>
      <form @submit.prevent="addForm">
        <div class="form-control">
          <label for="id">Serial No</label>
          <q-input square outlined v-model="item.id" class="input" id="id"  />
        </div>
        <div class="form-control">
          <label for="category">Category</label>
          <q-input square outlined v-model="item.category" class="input" id="category" />
        </div>
        <div class="form-control">
          <label for="name">Name</label>
          <q-input square outlined v-model="item.name" class="input" id="name" />
        </div>

        <div class="form-control">
          <label for="qty">Quantity</label>
          <q-input square outlined v-model="item.qty" class="input" id="qty" type="number" />
        </div>
        <div class="form-control">
          <label for="supp">Supplier</label>
          <q-input square outlined v-model="item.supplier" class="input" id="supp" />
        </div>
        <q-btn
          align="center"
          class="btn-fixed-width label"
          color="primary"
          style="width: 100%"
          label="Update"
          type="submit"
        />
      </form>
    </base-card>
  </q-page>
</template>
<script setup>
import BaseCard from "src/components/UI/BaseCard.vue";
import { useRouter } from "vue-router";
import {  reactive } from "vue";
import { useQuasar } from "quasar";
 const router = useRouter()
 const $q = useQuasar()
const item = reactive({
  id: "",
  category: "",
  name: "",
  qty: "",
  supplier: "",
});
//temporary
function addForm(){
    console.log(item);
    router.push('/home');
}




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
