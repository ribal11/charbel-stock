<template>
  <q-page class="container">
    <base-card>
      <form @submit.prevent="updateForm">
        <div class="form-control">
          <label for="sn">Serial No</label>
          <q-input square outlined v-model="item.id" class="input" id="sn" />
        </div>
        <div class="form-control">
          <label for="cat">Category</label>
          <q-input square outlined v-model="item.category" class="input" id="cat" />
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
import { defineProps, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import BaseCard from "src/components/UI/BaseCard.vue";
import { useQuasar } from "quasar";

const $q = useQuasar()
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const item = reactive({
  id: "4",
  category: "reactor",
  name: "test",
  qty: "5",
  supplier: "ribal",
});

//temporary function
function updateForm(){
    console.log(item);
    router.push('/home')
}





//update the data in the db 

// async function updateForm() {
//   if(item.qty < 0){
//     $q.dialog({
//       title: "Alert",
//       message: "quantity cant be negative",
//     }).onOk(() => {
//       console.log("OK");
//     });}
//     else{
//   try {
//     const response = await fetch("https://localhost:3000/api/update", {
//       method: "put",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(item),
//     });
//     if(response.ok){
//         router.push('/home');
//     } else {
//         console.log('there is an error');
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
// }

//get the data of the item with this id

// onMounted(async ()=>{
//     try{
//     const response =  await fetch(`https://localhost:3000/api/get/${id}`);
//     const data  = await response.json();
//     item.id = data.SerialNumber;
//     item.category =data.category;
//     item.name = data.name;
//     item.qty = data.qty;
//     item.supplier = data.supplier;
//     } catch(err){
//         console.log(err);
//     }
// })
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
