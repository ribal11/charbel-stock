<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Menu </q-toolbar-title>

        <div><q-btn icon="logout" flat rounded @click="logout"></q-btn></div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list padding>
        <q-item
          clickable
          @click="stockView()"
          v-ripple
          to="/"
          exact
          :class="{ 'grey': $route.name === 'home' }"
        >
          <q-item-section> Stock View </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="createBill()"
          v-ripple
          to="/home/check"
          exact
          :class="{ 'grey': $route.name === 'bill' }"
        >
          <q-item-section> Create Bill </q-item-section>
        </q-item>

        <q-item
          clickable
          @click="buy()"
          v-ripple
          to="/home/buy"
          exact
          :class="{ 'grey': $route.name === 'buy' }"
        >
          <q-item-section> Buy </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useQuasar } from "quasar";
import {useRouter} from "vue-router"
import { ref } from "vue";

const leftDrawerOpen = ref(false);
const active = ref("home");
const $q = useQuasar()
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout(){
  $q.dialog({
    title:"Confirm",
    message:"are you sure you want to logout?",
    cancel:true
  }).onOk(()=> {
    localStorage.removeItem('token');
    router.push('/login');
  })
}

</script>

<style scoped>
.grey {
  background-color: lightgray;
}
</style>
