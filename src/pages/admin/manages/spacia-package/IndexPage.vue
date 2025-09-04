<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <q-table
        flat
        :rows="spacialPackages"
        :columns="columns"
        row-key="id"
        class="full-width"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        @update:pagination="getSpacialPackages($event)"
        :loading="loading"
      >
        <template v-slot:top-left>
          <q-btn round size="md" flat color="primary" style="margin: 0px 10px 0px 0px" icon="arrow_back" @click="goBack" />
          <div class="text-subtitle1" style="font-weight: 600">ລາຄາ Package ສິດທີພິເສດ</div>
        </template>
        <template v-slot:top-right>
          <q-btn color="primary" outline round icon="add" size="sm" @click="dialog = true" />
        </template>
        <template v-slot:no-data>
          <div class="row items-center justify-center text-center" style="width: 100%; height: 200px">
            <div v-if="loading == true" class="q-gutter-y-md">
              <q-spinner v-if="loading" name="dots" color="primary" size="60px" />
              <div class="text-subtitle2">Wait for data loading...</div>
            </div>
            <div v-else class="q-gutter-y-md">
              <q-icon name="mdi-database-remove" size="60px" color="primary" />
              <div class="text-subtitle2">Opps! Not found data</div>
            </div>
          </div>
        </template>
        <template v-slot:body-cell-packages="props">
          <q-td :props="props">
            <div>
              {{ props.row.packages.packageName }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-cost="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.packages.price) }} LAK</div>
          </q-td>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.price) }} LAK</div>
          </q-td>
        </template>
        <template v-slot:body-cell-users="props">
          <q-td :props="props">
            <div>
              {{ props.row.users.username }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-isManual="props">
          <q-td :props="props">
            <div>
              <q-toggle
                v-model="props.row.isManual"
                checked-icon="check"
                unchecked-icon="clear"
                color="primary"
                :label="props.row.isManual ? 'ເປີດ' : 'ປິດ'"
                @update:model-value="enableManual(props.row)"
              />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            <div>
              <q-icon name="schedule" size="xs" color="green" class="q-mr-sm" />
              {{ formatDate(props.value) }}
              <q-tooltip>
                {{ formatDate(props.value, 'dddd, MMMM Do YYYY, h:mm:ss a') }}
              </q-tooltip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-updatedAt="props">
          <q-td :props="props">
            <div>
              <q-icon name="update" size="xs" color="orange" class="q-mr-sm" />
              {{ formatDate(props.value) }}
              <q-tooltip>
                {{ formatDate(props.value, 'dddd, MMMM Do YYYY, h:mm:ss a') }}
              </q-tooltip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" style="width: 100px">
            <div class="row items-center justify-around">
              <q-btn
                outline
                round
                size="sm"
                color="primary"
                icon="edit"
                @click="editSpacialPackage(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ແກ້ໄຂຂໍ້ມູນ</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteSpacialPackage(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ລຶບຂໍ້ມູນ</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="width: 400px; border-radius: var(--rounded-md)">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-bold">ແກ້ໄຂລາຄາ Package ສິດທີພິເສດ</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="clearData" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ຕົວແທນ</div>
            <q-select
              class="custom-input"
              outlined
              v-model="spacialPackage_model.uid"
              :options="users"
              option-value="id"
              option-label="username"
              emit-value
              map-options
              required
              clearable
              :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ຕົວແທນ']"
            >
              <template v-slot:prepend>
                <q-icon name="record_voice_over" />
              </template>
            </q-select>

            <div class="input-label">ລາຄາຕົ້ນທືນ</div>
            <q-input v-model="packageData!.price" prefix="LAK" outlined class="custom-input" disable>
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>

            <div class="input-label">ລາຄາພິເສດ</div>
            <q-input
              v-model="spacialPackage_model.price"
              placeholder="ລາຄາພິເສດ"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ລາຄາພິເສດ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>
            <q-toggle
              v-model="spacialPackage_model.isManual"
              style="margin-top: 10px"
              checked-icon="check"
              unchecked-icon="clear"
              color="primary"
              label="ກຳນົດລາຄາ"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm custom-btn" @click="clearData" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm custom-btn" @click="saveSpacialPackage" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="processing" persistent width="100%" height="100%">
      <q-circular-progress v-if="processing" indeterminate size="100px" :thickness="0.15" color="primary" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
  formatDate,
  dialogDelay,
  cfmBtnColor,
  cancelBtnColor,
  cfmBtnText,
  cancelBtnText,
  formatNumber,
} from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';
import { SpacialPackage } from 'src/interfaces/package';
import { package_service } from 'src/services/package.service';
import { useRoute, useRouter } from 'vue-router';
import { User } from 'src/interfaces/user';
import { user_service } from 'src/services/user.service';
import { usePackageStore } from 'src/stores/package-store';

const packageStore = usePackageStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isAdmin = authStore.userAuth?.role === 'admin';

const packageData = packageStore.getPackage();
const formRef = ref<any>(null);
const packageService = package_service();
const userService = user_service();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const packageId = Number(route.params.packageId);
const pagination = ref<TablePagination>({
  page: 1,
  toPage: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const users = ref<User[]>([]);
const spacialPackages = ref<SpacialPackage[]>([]);
const spacialPackage_model = ref<SpacialPackage>({
  id: null,
  packageId: packageId,
  uid: null,
  price: null,
  isManual: true,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'packages', label: 'Package', field: 'packages.packageName', sortable: true, align: 'left' as const },
  { name: 'cost', label: 'ລາຄາຕົ້ນທືນ', field: 'packages.price', sortable: true, align: 'left' as const },
  { name: 'price', label: 'ລາຄາພິເສດ', field: 'price', sortable: true, align: 'left' as const },
  { name: 'users', label: 'ຕົວແທນ', field: 'users.username', sortable: true, align: 'left' as const },
  { name: 'isManual', label: 'ກຳນົດລາຄາເອງ', field: 'isManual', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const goBack = () => {
  router.back();
};

const clearData = () => {
  dialog.value = false;
  spacialPackage_model.value = { id: null, packageId: packageId, uid: null, price: null, isManual: true };
};

// Action handlers
const editSpacialPackage = (spacialPackage: SpacialPackage) => {
  dialog.value = true;
  spacialPackage_model.value = { ...spacialPackage, packageId: packageId };
  delete spacialPackage_model.value.packages;
  delete spacialPackage_model.value.users;
};

const deleteSpacialPackage = async (spacialPackage: SpacialPackage) => {
  await Swal.fire({
    title: 'ລຶບລາຄາພິເສດ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບລາຄາພິເສດນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeleteSpacialPackage(spacialPackage.id!);
    }
  });
  clearData();
};

const onDeleteSpacialPackage = async (spacialPackage_id: number) => {
  await packageService.deleteSpacialPackage(spacialPackage_id).then(async (response) => {
    await Swal.fire({
      title: response.message,
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getSpacialPackages();
  });
};

const saveSpacialPackage = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    spacialPackage_model.value.price = Number(spacialPackage_model.value.price);
    spacialPackage_model.value.uid = Number(spacialPackage_model.value.uid);
    if (spacialPackage_model.value.id) {
      await updateSpacialPackage();
    } else {
      await addSpacialPackage();
    }
  } catch (error) {
    processing.value = false;
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
      showCloseButton: true,
    });
  } finally {
    clearData();
  }
};

const addSpacialPackage = async () => {
  await packageService.createSpacialPackage(spacialPackage_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກສຳເລັດ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getSpacialPackages();
  });
};

const updateSpacialPackage = async () => {
  await packageService
    .updateSpacialPackage(spacialPackage_model.value.id!, spacialPackage_model.value)
    .then(async (response) => {
      processing.value = false;
      await Swal.fire({
        title: 'ສຳເລັດ',
        text: 'ແກ້ໄຂສຳເລັດ',
        icon: response.code == '200' ? 'success' : 'error',
        timer: dialogDelay,
        confirmButtonColor: cfmBtnColor,
      });
      void getSpacialPackages();
    });
};

const enableManual = async (spacialPackage: SpacialPackage) => {
  await packageService
    .updateSpacialPackage(spacialPackage.id!, { isManual: spacialPackage.isManual })
    .then(async (response) => {
      await Swal.fire({
        title: 'ສຳເລັດ',
        text: spacialPackage.isManual ? 'ເປີດກຳນົດລາຄາເອງສຳເລັດແລ້ວ' : 'ປິດກຳນົດລາຄາເອງສຳເລັດແລ້ວ',
        icon: response.code == '200' ? 'success' : 'error',
        timer: dialogDelay,
        confirmButtonColor: cfmBtnColor,
      });
    });
};

const getSpacialPackages = async (options?: { page: number; rowsPerPage: number }) => {
  if (options && pagination.value.page == options.page) return;
  loading.value = true;
  try {
    const response = await packageService.getSpacialPackages(packageId);
    spacialPackages.value = response.data;
    pagination.value.rowsNumber = response.total ?? 1;
  } catch (error) {
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  } finally {
    loading.value = false;
  }
};

const getUsers = async () => {
  const response = await userService.getUsers();
  users.value = response.data;
};

onMounted(async () => {
  try {
    void getUsers();
    await getSpacialPackages();
  } catch (error) {
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  }
});
</script>
