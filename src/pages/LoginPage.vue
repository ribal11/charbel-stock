<template>
  <div class="main">
    <!-- <h1>Login</h1> -->
    <div class="card-container">
      <base-card>
        <form @submit.prevent="submitForm">
          <q-input
            outlined
            v-model="email"
            type="email"
            prefix="Email:"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input
            outlined
            v-model="password"
            type="password"
            prefix="Password:"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
          </q-input>
          <q-btn
            align="center"
            class="btn-fixed-width label"
            color="primary"
            style="width: 100%"
            label="Login"
            type="submit"
          />
        </form>
      </base-card>
    </div>
  </div>
</template>

<script setup>
import BaseCard from "../components/UI/BaseCard.vue";
import { useQuasar } from "quasar";
import { reactive, ref } from "vue";
import {  useRouter } from 'vue-router';


const router = useRouter();
const $q = useQuasar();
const email = ref("");
const password = ref("");
const dumyData = reactive({
    email:'ribal@gmail.com',
    password:'ribal'
})

async function submitForm() {
  if (email.value === "" || password.value === "") {
    $q.dialog({
      title: "Alert",
      message: "Please fill in both email and password fields.",
    }).onOk(() => {
      console.log("OK");
    });
   } else {
//     const api = "the api";
//     const data = {
//       email: email.value,
//       password: password.value,
//     };
//     try {
//       const response = await fetch(api, {
//         method: "post",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });
//       if (response.ok) {
//         localStorage.setItem('token','code');
//         router.push('/home');
//       } else {
//         const errorData = await response.json();
//         if (errorData === "wrong password") {
//           $q.dialog({
//             title: "Alert",
//             message: "email or password wrong",
//           }).onOk(() => {
//             console.log("OK");
//           });
//         } else if(errorData === 'email not found') {
//             $q.dialog({
//             title: "Alert",
//             message: "email not found",
//           }).onOk(() => {
//             console.log("OK");
//           });
//         } else {
//             $q.dialog({
//             title: "Alert",
//             message: "an error has occured",
//           }).onOk(() => {
//             console.log("OK");
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Error:", err);
//     }
        if(email.value === dumyData.email && password.value === dumyData.password){
            localStorage.setItem('token','code');
            router.push('/home');
        }
   }

}
</script>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column; /* Align items vertically */
  justify-content: center;
  align-items: center;
}

/* .card-container {
    text-align: center;  Center the content horizontally 
  } */

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 1.5rem;
}

h1 {
  display: block;
}
.label {
  font-size: large;
  margin-top: 1rem;
}
</style>
