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

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
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
          to="/"
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
import { ref } from "vue";

const leftDrawerOpen = ref(false);
const active = ref("home");



function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function createBill(){
  active.value='bill';
}

function stockView(){
  active.value='home';
}

function buy(){
  active.value='buy'
}

</script>

<style scoped>
.grey {
  background-color: lightgray;
}
</style>
