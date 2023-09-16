<template>

    <q-card>
      <form @submit.prevent="updateForm">
        <q-card-section>
          <label for="sn">Serial No</label>
          <q-input square outlined v-model="item.id"  id="sn" />
        </q-card-section>
        <q-card-section>
          <label for="cat">Category</label>
          <q-input square outlined v-model="item.category"  id="cat" />
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
        />
      </q-card-actions>
      </form>
    </q-card>


</template>

<script setup>
import { defineProps, onMounted, reactive, watch } from "vue";
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

watch(() => item.qty,(newQty, oldQty) => {
  if(Number(newQty) < 0 || isNaN(newQty)){
    item.qty = "0";
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
