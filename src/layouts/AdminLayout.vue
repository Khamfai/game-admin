<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="header">
      <q-toolbar>
        <q-btn flat dense round color="primary" icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>
          <q-btn outline size="sm" round color="primary" icon="account_circle">
            <q-popup-proxy
              transition-show="slide-left"
              transition-hide="slide-right"
              style="border-radius: var(--rounded-sm)"
            >
              <q-list>
                <div class="column items-center justify-center">
                  <q-item>
                    <q-avatar color="primary">
                      <q-icon name="mdi-account-circle-outline" color="white" />
                    </q-avatar>
                  </q-item>
                  <q-item>
                    <div class="column items-center justify-center">
                      <q-item-label>{{ profile?.balance ?? 0 }} LAK</q-item-label>
                      <q-item-label>{{ profile?.role }}</q-item-label>
                      <q-item-label>{{ profile?.email ?? profile?.phone }}</q-item-label>
                    </div>
                  </q-item>
                </div>
                <q-separator />
                <q-item>
                  <q-btn color="primary" icon="logout" outline rounded label="Logout" @click="logout" v-close-popup />
                </q-item>
              </q-list>
            </q-popup-proxy>
          </q-btn>
        </div>
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
import { computed, ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue';
import { useAuthStore } from 'src/stores/auth-store';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { cfmBtnColor } from 'src/utils/utils';
import { cancelBtnColor } from 'src/utils/utils';
import useProfileStore from 'src/stores/profile-store';

const authStore = useAuthStore();
const router = useRouter();
const profileStore = useProfileStore();
const profile = profileStore.getProfile();

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
    link: '/#/admin/users',
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

async function logout() {
  await Swal.fire({
    title: 'Warning',
    text: 'ຕ້ອງການອອກຈາກລະບົບ ຫຼື ບໍ່?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      authStore.logout();
      void router.push('/login');
    }
  });
}
</script>

<style scoped>
.header {
  background-color: #e0e1e1;
  color: var(--text-color);
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}
</style>
