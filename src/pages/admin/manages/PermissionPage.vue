<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <q-table
        title="ສິດທີການຈັດການລະບົບ"
        flat
        :rows="permissions"
        :columns="columns"
        row-key="name"
        class="full-width"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        @update:pagination="getPermissions($event)"
        :loading="loading"
      >
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
                @click="editPermission(props.row)"
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
                @click="deletePermission(props.row)"
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
          <div class="text-subtitle1 text-bold">ແກ້ໄຂສິດທີການຈັດການລະບົບ</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="colseAddDialog" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ສິດທີການຈັດການລະບົບ</div>
            <q-input
              v-model="permission_model.name"
              placeholder="ສິດທີການຈັດການລະບົບ"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ສິດທີການຈັດການລະບົບ']"
            >
              <template v-slot:prepend>
                <q-icon name="security" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm custom-btn" @click="colseAddDialog" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm custom-btn" @click="savePermission" />
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
import { permission_service } from 'src/services/permission.service';
import { formatDate, cfmBtnColor, cfmBtnText, cancelBtnColor, cancelBtnText, dialogDelay } from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';
import { Permission } from 'src/interfaces/permission';

const formRef = ref<any>(null);
const authStore = useAuthStore();
const permissionService = permission_service();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const isAdmin = authStore.userAuth?.role === 'admin';
const pagination = ref<TablePagination>({
  page: 1,
  toPage: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const permissions = ref<Permission[]>([]);
const permission_model = ref<Permission>({ id: null, name: '' });
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'name', label: 'ສິດທີການຈັດການລະບົບ', field: 'name', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const colseAddDialog = () => {
  dialog.value = false;
  permission_model.value = { id: null, name: '' };
};

// Action handlers
const editPermission = (permission: Permission) => {
  dialog.value = true;
  permission_model.value = permission;
};

const deletePermission = async (permission: Permission) => {
  await Swal.fire({
    title: 'ລຶບສິດທີການຈັດການລະບົບ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບສິດທີການຈັດການລະບົບນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeletePermission(permission.id!);
    }
  });
  permission_model.value = { id: null, name: '' };
};

const onDeletePermission = async (permission_id: number) => {
  await permissionService.deletePermission(permission_id).then(async (response) => {
    await Swal.fire({
      title: response.message,
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getPermissions();
  });
};

const savePermission = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    if (permission_model.value.id) {
      await updatePermission();
    } else {
      await addPermission();
    }
  } catch (error) {
    processing.value = false;
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  } finally {
    permission_model.value = { id: null, name: '' };
  }
};

const addPermission = async () => {
  await permissionService.createPermission(permission_model.value.name).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກສຳເລັດ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
    });
    await getPermissions();
  });
};

const updatePermission = async () => {
  await permissionService
    .updatePermission(permission_model.value.id!, permission_model.value.name)
    .then(async (response) => {
      processing.value = false;
      await Swal.fire({
        title: 'ສຳເລັດ',
        text: 'ແກ້ໄຂສຳເລັດ',
        icon: response.code == '200' ? 'success' : 'error',
        timer: dialogDelay,
        confirmButtonColor: cfmBtnColor,
      });
      void getPermissions();
    });
};

const getPermissions = async (options?: { page: number; rowsPerPage: number }) => {
  if (options && pagination.value.page == options.page) return;

  const response = await permissionService.getPermissions();
  permissions.value = response.data;
  pagination.value.rowsNumber = response.total ?? 1;
};

onMounted(async () => {
  try {
    loading.value = true;
    await getPermissions();
    loading.value = false;
  } catch (error) {
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  } finally {
    loading.value = false;
  }
});
</script>
