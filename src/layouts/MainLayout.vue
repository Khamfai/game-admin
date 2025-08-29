<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="padding: 4px 10px">
      <q-toolbar>
        <q-toolbar-title>
          <div class="text-h5 text-bold">Game Service</div>
        </q-toolbar-title>
        <q-list class="row">
          <q-item clickable @click="router.push('/login')">
            <q-item-section >
              <q-item-label>Login</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable @click="router.push('/signup')">
            <q-item-section>
              <q-item-label>Sign Up</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>
