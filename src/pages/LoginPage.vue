<template>
  <!-- <q-page> -->
  <div class="fullscreen bg row justify-center items-center">
    <div class="card col-lg-4 col-md-6 col-sm-8 col-xs-12">
      <q-card-section>
        <div class="row justify-center">
          <q-avatar size="80px" color="secondary" text-color="white">
            <q-icon name="mdi-account-circle" size="60px" />
          </q-avatar>
        </div>
        <h4 class="text-h4 text-center text-bold" style="color: var(--text-color)">Sign In</h4>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <div class="text-bold" style="color: var(--text-color)">Username</div>
        <q-input
          v-model="username"
          outlined
          rounded
          placeholder="Enter username"
          :rules="[(val) => val.length > 0 || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ຫຼື ອີເມວ']"
          :disable="loading"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-account-circle" />
          </template>
        </q-input>

        <div class="text-bold" style="color: var(--text-color)">Password</div>
        <q-input
          v-model="password"
          :type="isVisible ? 'text' : 'password'"
          outlined
          rounded
          placeholder="Enter password"
          :rules="[(val) => val.length > 0 || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
          :disable="loading"
          @keyup.enter="handleLogin"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-key" />
          </template>
          <template v-if="password.length > 0" v-slot:append>
            <q-icon :name="isVisible ? 'mdi-eye' : 'mdi-eye-off'" @click="isVisible = !isVisible" />
          </template>
        </q-input>

        <!-- Error message -->
        <div v-if="errorMessage" class="text-negative text-center q-mt-sm">
          {{ errorMessage }}
        </div>
      </q-card-section>
      <q-card-actions style="height: 150px">
        <q-btn
          label="Login"
          size="md"
          color="primary"
          rounded
          class="full-width"
          style="height: 45px"
          :loading="loading"
          @click="handleLogin"
        />
        <div class="row justify-between q-gutter-x-md" style="width: 100%">
          <div class="cols-4"><a style="text-decoration: none" href="/#/forgot-password">Forgot password?</a></div>
          <div class="cols-8" style="color: var(--text-color)">
            Get starting to seller account
            <a style="text-decoration: none; font-weight: bold" href="/#/signup">Sign up</a>
          </div>
        </div>
      </q-card-actions>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { auth_service } from 'src/services/auth.service';
import { authMiddleware } from 'src/middlewares/auth.middleware';
import { useAuthStore } from 'src/stores/auth-store';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authService = auth_service();

const authStore = useAuthStore();

const isVisible = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const username = ref('');
const password = ref('');

onMounted(async () => {
  if (authStore.isAuthenticated && authStore.accessToken) {
    const { isAuthenticated, to } = authMiddleware.execute({ to: route, from: route, next: () => {} });
    if (isAuthenticated && to.query?.redirect == null) {
      const role = authStore.userAuth?.role;
      await router.push(role === 'admin' ? '/admin' : '/');
    }
  }
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const { code, data } = await authService.login({
      username: username.value,
      password: password.value,
    });

    if (code === '200' && data != null)
      if (data.user.role == 'admin') await router.push((route.query.redirect as string) || '/admin');
      else await router.push('/seller');
    else errorMessage.value = 'Login failed. Please try again.';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed. Please try again.';

    $q.notify({
      type: 'negative',
      message: errorMessage.value,
      position: 'top',
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg {
  height: 100vh;
  background-image:
    url('assets/images/1288360.jpg'), linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-blend-mode: overlay;
}

.card {
  color: var(--q-primary);
  background-color: rgba(212, 212, 212, 0.7);
  border-radius: 10px;
  box-shadow: rgba(1, 50, 108, 0.6) 0px 5px 50px;
  padding: 20px;
}
</style>
