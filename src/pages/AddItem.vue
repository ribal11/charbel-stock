<template>

    <q-card>
      <form>
      <q-card-section>
        
          <label for="id">Serial No</label>
          <q-input square outlined v-model="item.id"  id="id"  />
        </q-card-section>
        <q-card-section>
          <label for="category">Category</label>
          <q-input square outlined v-model="item.category"  id="category" />
        </q-card-section>
        <q-card-section>
          <label for="name">Name</label>
          <q-input square outlined v-model="item.name"  id="name" />
        </q-card-section>

        <q-card-section>
          <label for="qty">Quantity</label>
          <q-input square outlined v-model="item.qty"  id="qty" type="number" min="0" />
        </q-card-section>
        <q-card-section>
          <label for="supp">Supplier</label>
          <q-input square outlined v-model="item.supplier"  id="supp" />
        </q-card-section>
        <q-card-actions>
        <q-btn
          align="center"
          class="btn-fixed-width label"
          color="primary"
          style="width: 100%"
          label="Update"
          type="submit"
        /></q-card-actions>
      </form>
    
    </q-card>

</template>
<script setup>
import BaseCard from "src/components/UI/BaseCard.vue";
import { useRouter } from "vue-router";
import {  reactive, watch } from "vue";
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

watch(()=>item.qty,(newQty,oldQty) => {
  if (Number(newQty) < 0 || isNaN(newQty)){
    item.qty = "0";
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
