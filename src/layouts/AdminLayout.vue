<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-btn flat dense round color="primary" icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <div>
            <div class="text-h6">Game Service</div>
          </div>
        </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';

const linksList: EssentialLinkProps[] = [
  {
    title: 'Dashboard',
    caption: 'ໜ້າຫລັກ',
    icon: 'dashboard',
    link: '/#/admin',
  },
  {
    title: 'Roles',
    caption: 'ສິດທີຜູ້ໃຊ້ລະບົບ',
    icon: 'security',
    link: '/#/admin/roles',
  },
  {
    title: 'Permissions',
    caption: 'ສິດຈັດການຂໍ້ມູນ',
    icon: 'mdi-shield-account',
    link: '/#/admin/permissions',
  },
  {
    title: 'Sellers',
    caption: 'ຕົວແທນການຂາຍ',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Providers',
    caption: 'ຜູ້ໃຫ້ບໍລິການ',
    icon: 'mdi-handshake',
    link: '/#/admin/providers',
  },
  {
    title: 'Services',
    caption: 'ບໍລິການເກມ ແລະ ອື່ນໆ',
    icon: 'mdi-controller',
    link: '/#/admin/services',
  },
  {
    title: 'Packages',
    caption: 'ແພັກເກັດບໍລິການ',
    icon: 'token',
    link: '/#/admin/packages',
  },
  {
    title: 'Topups',
    caption: 'ໂຄຕາການເຕີມ',
    icon: 'account_balance_wallet',
    link: '/#/admin/topups',
  },
  {
    title: 'Transactions',
    caption: 'ປະຫວັດການເຕີມເກມ',
    icon: 'mdi-paper-roll',
    link: '/#/admin/transactions',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

<style scoped>
.header {
  background-color: #e0e1e1;
  color: var(--text-color);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
