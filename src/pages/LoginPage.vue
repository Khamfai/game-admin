<template>
  <q-page>
    <div class="bg row justify-center items-center">
      <div class="card col-lg-4 col-md-6 col-sm-10 col-xs-12">
        <q-card-section>
          <div class="row justify-center">
            <q-avatar size="80px" color="primary" text-color="white">
              <q-icon name="mdi-account-circle" size="60px" />
            </q-avatar>
          </div>
          <h4 class="text-h4 text-center text-bold">Sign In</h4>
        </q-card-section>
        <q-card-section class="q-gutter-y-md">
          <div class="text-bold">Username</div>
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

          <div class="text-bold">Password</div>
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
          <div class="row justify-center q-gutter-x-md" style="width: 100%">
            <q-btn
              label="Login"
              size="md"
              color="primary"
              rounded
              class="col-5"
              style="height: 45px"
              :loading="loading"
              @click="handleLogin"
            />
            <q-btn
              label="Sign Up"
              size="md"
              rounded
              color="secondary"
              class="col-5"
              style="height: 45px"
              :disable="loading"
              @click="router.push('/signup')"
            />
          </div>
        </q-card-actions>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { auth_service } from 'src/services/auth.service';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const authService = auth_service();

const isVisible = ref(false);
const loading = ref(false);
const errorMessage = ref('');

const username = ref('');
const password = ref('');

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

    if (code === 200 && data) await router.push((route.query.redirect as string) || '/admin');
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
  background-color: rgba(212, 212, 212, 0.6);
  border-radius: 10px;
  box-shadow: rgba(1, 50, 108, 0.6) 0px 5px 50px;
  padding: 20px;
}
</style>
