<template>
  <!-- <q-page> -->
  <div class="fullscreen bg row justify-center items-center">
    <div class="card col-md-4 col-sm-8 col-xs-12">
      <div class="row justify-start">
        <q-btn
          color="secondary"
          style="background-color: #ffffff4a"
          size="md"
          flat
          icon="mdi-arrow-left"
          round
          no-caps
          @click="router.push('/login')"
        />
      </div>
      <div>
        <h4 class="text-h4 text-center text-bold" style="color: var(--text-color)">ລົງທະບຽນ</h4>
      </div>
      <q-card-section class="q-gutter-y-xs">
        <div class="text-bold input-label" style="color: var(--text-color)">Username</div>
        <q-input
          v-model="user.username"
          outlined
          class="custom-input"
          placeholder="Enter username"
          :rules="[(val) => val.length > 0 || 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້']"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-account-circle" />
          </template>
        </q-input>

        <div class="text-bold input-label" style="color: var(--text-color)">Email</div>
        <q-input v-model="user.email" class="custom-input" outlined placeholder="Enter email">
          <template v-slot:prepend>
            <q-icon name="mdi-email" />
          </template>
        </q-input>

        <div class="text-bold input-label" style="color: var(--text-color)">Phone</div>
        <q-input v-model="user.phone" outlined class="custom-input" placeholder="Enter phone number">
          <template v-slot:prepend>
            <q-icon name="mdi-phone" />
          </template>
        </q-input>

        <div class="text-bold input-label" style="color: var(--text-color)">Password</div>
        <q-input
          v-model="user.password"
          :type="isVisible ? 'text' : 'password'"
          class="custom-input"
          outlined
          placeholder="Enter password"
          :rules="[(val) => val.length > 0 || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ']"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-key" />
          </template>
          <template v-if="user.password.length > 0" v-slot:append>
            <q-icon :name="isVisible ? 'mdi-eye' : 'mdi-eye-off'" @click="isVisible = !isVisible" />
          </template>
        </q-input>

        <div class="text-bold input-label" style="color: var(--text-color)">Confirm Password</div>
        <q-input
          v-model="confirmPassword"
          :type="isVisible ? 'text' : 'password'"
          class="custom-input"
          outlined
          placeholder="Enter password"
          :rules="[
            (val) => val.length > 0 || 'ກະລຸນາປ້ອນລະຫັດຜ່ານ',
            (val) => val === user.password || 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="mdi-key" />
          </template>
          <template v-if="user.password.length > 0" v-slot:append>
            <q-icon :name="isVisible ? 'mdi-eye' : 'mdi-eye-off'" @click="isVisible = !isVisible" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions style="height: 150px; padding: 0px 15px">
        <q-btn
          label="Register"
          size="md"
          color="primary"
          rounded
          class="full-width"
          style="height: 45px"
          @click="register"
        />
      </q-card-actions>
    </div>
  </div>
  <!-- </q-page> -->
</template>

<script setup lang="ts">
import { UserRegister } from 'src/interfaces/user';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth_service } from 'src/services/auth.service';
import { useQuasar } from 'quasar';

const router = useRouter();
const $q = useQuasar();
const authService = auth_service();
const isVisible = ref(false);

const user = ref<UserRegister>({
  username: '',
  email: null,
  password: '',
  phone: null,
});
const confirmPassword = ref('');
const register = async () => {
  if (user.value.password !== confirmPassword.value) {
    $q.notify({
      type: 'negative',
      message: 'ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
    });
    return;
  }
  const { status, data } = await authService.register(user.value);

  if (status === 200 && data.status === 'success') {
    $q.notify({
      type: 'positive',
      message: 'ລົງທະບຽນສຳເລັດ',
    });
    await router.push('/login');
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
