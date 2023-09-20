<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Menu </q-toolbar-title>

        <div><q-btn icon="logout" flat rounded @click="logout"></q-btn></div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-list padding>
        <q-item clickable v-ripple to="/" exact :class="{ 'grey': $route.name === 'home' }">
          <q-item-section> Stock View </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/home/check" exact :class="{ 'grey': $route.name === 'bill' }">
          <q-item-section> Sales Invoice </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/home/buy" exact :class="{ 'grey': $route.name === 'buy' }">
          <q-item-section> Purchase Invoice </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/home/salesInvoices" exact :class="{ 'grey': $route.name === 'salesInvoices' }">
          <q-item-section> View Sales Invoices </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/home/purchaseInvoice" exact :class="{ 'grey': $route.name === 'purchaseInvoice' }">
          <q-item-section> View Sales Invoices </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { LocalStorage, useQuasar } from "quasar";
import { useRouter } from "vue-router"
import { ref } from "vue";

const leftDrawerOpen = ref(false);
const active = ref("home");
const $q = useQuasar()
const router = useRouter();

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to logout?",
    cancel: true
  }).onOk(() => {
    LocalStorage.remove('userData');
    router.push('/login');
  })
}

</script>

<style scoped>
.grey {
  background-color: lightgray;
}
</style>
