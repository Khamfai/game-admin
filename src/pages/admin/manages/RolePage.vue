<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <q-table
        title="ສິດທີຂອງຜູ້ໃຊ້ງານລະບົບ"
        flat
        :rows="roles"
        :columns="columns"
        row-key="roleName"
        class="full-width"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        @update:pagination="getRoles($event)"
        :loading="loading"
      >
        <template v-slot:top-right>
          <q-btn color="secondary" outline round icon="add" size="sm" @click="dialog = true" />
        </template>
        <template v-slot:body-cell-createdAt="props">
          <q-td :props="props">
            <div>
              <q-icon name="schedule" size="xs" color="green" class="q-mr-sm" />
              {{ formatDate(props.value, 'DD/MM/YYYY') }}
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
              {{ formatDate(props.value, 'DD/MM/YYYY') }}
              <q-tooltip>
                {{ formatDate(props.value, 'dddd, MMMM Do YYYY, h:mm:ss a') }}
              </q-tooltip>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" style="width: 100px">
            <div class="row items-center justify-around">
              <q-btn outline round size="sm" color="secondary" icon="edit" @click="editRole(props.row)" :disable="!isAdmin">
                <q-tooltip>ແກ້ໄຂສິດທີ</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteRole(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ລຶບສິດທີ</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="width: 400px; border-radius: var(--rounded-md)">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-bold">ແກ້ໄຂສິດທີການໃຊ້ລະບົບ</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="colseAddDialog" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ສິດທີການໃຊ້ລະບົບ</div>
            <q-input
              v-model="role_model.roleName"
              placeholder="ສິດທີການໃຊ້ລະບົບ"
              outlined
              rounded
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ສິດທີການໃຊ້ລະບົບ']"
            >
              <template v-slot:prepend>
                <q-icon name="security" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm" @click="colseAddDialog" />
          <q-btn label="ບັນທຶກ" color="secondary" class="border-rounded-sm" @click="saveRole" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="processing" persistent width="100%" height="100%">
      <q-circular-progress v-if="processing" indeterminate size="100px" :thickness="0.15" color="primary" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { Role } from 'src/interfaces/role';
import { onMounted, ref } from 'vue';
import { role_service } from 'src/services/role.service';
import { formatDate, dialogDelay, cfmBtnColor, cancelBtnColor, cfmBtnText, cancelBtnText } from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';

const formRef = ref<any>(null);
const authStore = useAuthStore();
const roleService = role_service();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const isAdmin = authStore.userAuth?.role === 'admin';
const pagination = ref<TablePagination>({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});

const roles = ref<Role[]>([]);
const role_model = ref<Role>({ id: null, roleName: '' });
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'roleName', label: 'ສິດທີການໃຊ້ລະບົບ', field: 'roleName', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const colseAddDialog = () => {
  dialog.value = false;
  role_model.value = { id: null, roleName: '' };
};

// Action handlers
const editRole = (role: Role) => {
  dialog.value = true;
  role_model.value = role;
};

const deleteRole = async (role: Role) => {
  await Swal.fire({
    title: 'ລຶບສິດທີການໃຊ້ລະບົບ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບສິດທີການໃຊ້ລະບົບນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeleteRole(role.id!);
    }
  });
  role_model.value = { id: null, roleName: '' };
};

const onDeleteRole = async (role_id: number) => {
  await roleService.deleteRole(role_id).then(async (response) => {
    await Swal.fire({
      title: response.message,
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getRoles();
  });
};

const saveRole = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    if (role_model.value.id) {
      await updateRole();
    } else {
      await addRole();
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
    role_model.value = { id: null, roleName: '' };
  }
};

const addRole = async () => {
  await roleService.createRole(role_model.value.roleName).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກສຳເລັດ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getRoles();
  });
};

const updateRole = async () => {
  await roleService.updateRole(role_model.value.id!, role_model.value.roleName).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ແກ້ໄຂສຳເລັດ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    void getRoles();
  });
};

const getRoles = async (options?: { page: number; rowsPerPage: number }) => {
  if (options && pagination.value.page == options.page) return;

  const response = await roleService.getRoles();
  roles.value = response.data;
  pagination.value.rowsNumber = response.total ?? 1;
};

onMounted(async () => {
  try {
    loading.value = true;
    await getRoles();
    loading.value = false;
  } catch (error) {
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  } finally {
    loading.value = false;
  }
});
</script>
