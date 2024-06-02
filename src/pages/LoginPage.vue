<template>
  <div class="main">
    <!-- <h1>Login</h1> -->

    <q-card>
      <loading-component v-if="isLoading" />
      <q-card-section>
        <div class="text-h4 text-center">Login</div>
      </q-card-section>
      <q-card-section>
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
        <q-input outlined v-model="password" type="password" prefix="Password:">
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
          @click="onSubmit"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { LocalStorage, useQuasar } from "quasar";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useStore } from "src/stores/store";
import ENV from "src/helpers/globals";
import LoadingComponent from "src/components/LoadingComponent.vue";

const store = useStore();
const { isLoading } = storeToRefs(store);
const { setIsLoading } = store;
const $router = useRouter();
const $q = useQuasar();
const email = ref("");
const password = ref("");

const onSubmit = async () => {
  if (!email.value || !password.value) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: "Missing User Name or Password",
    });
    return;
  } else {
    try {
      setIsLoading(true);
      const body = JSON.stringify({
        code: email.value,
        password: password.value,
      });

      let resp = await fetch(`${ENV.HomeURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });

      if (!resp.ok) {
        resp = await resp.json();
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "warning",
          message: resp,
        });
      } else {
        resp = await resp.json();
        LocalStorage.set("userData", resp);
        $router.replace({ path: "/home" });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }
};
</script>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* Align items vertically */
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
