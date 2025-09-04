<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="padding: 12px">
        <q-input
          v-model="search"
          placeholder="ຄົ້ນຫາ"
          outlined
          rounded
          class="custom-input"
          @update:model-value="search && search.length == 0 ? searchUser() : null"
        >
          <template v-slot:prepend>
            <q-btn icon="search" flat round color="primary" @click="searchUser" />
          </template>
          <template v-if="search && search.length > 0" v-slot:append>
            <q-btn
              icon="close"
              unelevated
              round
              size="sm"
              color="grey-4"
              text-color="black"
              @click="
                search = '';
                searchUser();
              "
            />
          </template>
        </q-input>
      </div>
      <q-separator />
      <!-- Table data -->
      <q-table
        title="ຕົວແທນ"
        flat
        :rows="users"
        :columns="columns"
        row-key="name"
        class="full-width"
        :pagination="{
          rowsPerPage: pagination.rowsPerPage,
        }"
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
        <template v-slot:body-cell-roles="props">
          <q-td :props="props">
            <div>{{ props.row.roles.roleName }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-userPermissions="props">
          <q-td :props="props">
            <div class="row items-center" style="gap: 2px">
              <span>{{ props.row.userPermissions.map((usp: any) => usp.permissions.name).join(', ') }}</span>
              <q-btn icon="edit" size="sm" round flat color="primary" @click="editUserPermissions(props.row)" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-userKey="props">
          <q-td :props="props">
            <div style="align-content: center; margin-top: 5px">
              <span class="q-mr-sm">{{ props.row.userKey }}</span>
              <q-btn icon="mdi-content-copy" size="sm" round flat color="primary" @click="copyUserKey(props.row.userKey)" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-percent="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.percent, 2) }} %</div>
          </q-td>
        </template>
        <template v-slot:body-cell-balance="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.balance, 2) }} LAK</div>
          </q-td>
        </template>
        <template v-slot:body-cell-isEnable="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-toggle
                v-model="props.row.isEnable"
                checked-icon="check"
                unchecked-icon="clear"
                color="primary"
                :label="props.row.isEnable ? 'ເປີດ' : 'ປິດ'"
                @update:model-value="enableUser(props.row)"
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
          <q-td :props="props">
            <div class="row items-center justify-center" style="width: 100px; gap: 13px">
              <q-btn outline round size="sm" color="primary" icon="edit" @click="editUser(props.row)" :disable="!isAdmin">
                <q-tooltip>ແກ້ໄຂຂໍ້ມູນ</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteUser(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ລຶບຂໍ້ມູນ</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <q-space />
          <PaginationComponent
            :pagination="pagination"
            :rows-per-page-options="[10, 30, 50, 100]"
            rows-per-page-label="ຈຳນວນຂໍ້ມູນຕໍ່ຫນ້າ"
            @rows-per-page-change="onRowsPerPageChange"
            @first-page="onFirstPage"
            @prev-page="onPrevPage"
            @next-page="onNextPage"
            @last-page="onLastPage"
          />
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="max-width: 600px; width: 100%; border-radius: var(--rounded-md)">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-bold">ແກ້ໄຂຂໍ້ມູນຕົວແທນ</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="clearData" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">Username</div>
            <q-input
              v-model="user_model.username"
              placeholder="Username"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ Username']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account-circle" />
              </template>
            </q-input>
            <div class="input-label">Email</div>
            <q-input v-model="user_model.email" placeholder="Email" outlined class="custom-input" clearable>
              <template v-slot:prepend>
                <q-icon name="mdi-email" />
              </template>
            </q-input>
            <div class="row" style="display: flex; flex-direction: row">
              <div class="col-6">
                <div class="input-label">Phone</div>
                <q-input
                  v-model="user_model.phone"
                  placeholder="Phone"
                  outlined
                  class="custom-input"
                  style="margin-right: 5px"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-phone" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <div class="input-label" style="margin-right: 5px">Percent</div>
                <q-input
                  v-model="user_model.percent"
                  placeholder="Percent"
                  outlined
                  class="custom-input"
                  style="margin-left: 5px"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-percent" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="input-label">Call Back URL</div>
            <q-input
              v-model="user_model.callBackUrl"
              placeholder="Call Back URL"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => (val.length > 0 && /^https?:\/\/.+/.test(val)) || 'ກະລຸນາໃສ່ URL ທີ່ຖືກຕ້ອງ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-web" />
              </template>
            </q-input>
            <div class="input-label">API Key</div>
            <q-input v-model="user_model.userKey" placeholder="API Key" outlined class="custom-input" clearable>
              <template v-slot:prepend>
                <q-icon name="mdi-key" />
              </template>
            </q-input>
            <div class="row" style="display: flex; flex-direction: row">
              <div class="col-6">
                <div class="input-label">Role</div>
                <q-select
                  class="custom-input"
                  outlined
                  v-model="user_model.roleId"
                  :options="roles"
                  option-value="id"
                  option-label="roleName"
                  style="margin-right: 5px"
                  emit-value
                  map-options
                  required
                  clearable
                  :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ສິດທີການໃຊ້ລະບົບ']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-security" />
                  </template>
                </q-select>
              </div>
              <div class="col-6">
                <div class="input-label" style="margin-left: 5px">Permissions</div>
                <q-select
                  class="custom-input"
                  outlined
                  v-model="user_model.userPermissions"
                  :options="permissions"
                  option-value="id"
                  option-label="name"
                  style="margin-left: 5px"
                  multiple
                  emit-value
                  map-options
                  required
                  clearable
                  :disable="user_model.id == null"
                  :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ສິດທີຈັດການລະບົບ']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-security" />
                  </template>
                </q-select>
              </div>
            </div>
            <div v-if="!user_model.id">
              <div class="input-label">ລະຫັດຜ່ານ</div>
              <q-input
                v-model="user_model.password"
                placeholder="ລະຫັດຜ່ານ"
                :type="!isVisible ? 'text' : 'password'"
                outlined
                class="custom-input"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="mdi-lock" />
                </template>
                <template v-slot:append>
                  <q-icon :name="isVisible ? 'mdi-eye' : 'mdi-eye-off'" @click="isVisible = !isVisible" />
                </template>
              </q-input>
            </div>
            <q-toggle
              v-model="user_model.isEnable"
              checked-icon="check"
              unchecked-icon="clear"
              style="margin-top: 10px"
              color="primary"
              label="ເປີດໃຊ້ງານ"
              @update:model-value="enableUser(user_model)"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm custom-btn" @click="clearData" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm custom-btn" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog_permissions" persistent>
      <q-card style="width: 400px; border-radius: var(--rounded-md)">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-bold">ແກ້ໄຂສິດທີຈັດການລະບົບ</div>
          <q-space />
          <q-btn
            outline
            round
            size="sm"
            color="negative"
            icon="close"
            @click="
              dialog_permissions = false;
              clearData();
            "
          />
        </q-card-section>
        <q-card-section>
          <div class="input-label">ເລືອກສິດທີຈັດການລະບົບ</div>
          <div class="col items-center q-gutter-y-sm">
            <div v-for="permission in permissions" :key="permission.id!">
              <q-checkbox
                :label="permission.name"
                :val="permission.id"
                v-model="newPermissions"
                color="primary"
                @update:model-value="updatePermissions(permission.id!)"
              />
            </div>
          </div>
        </q-card-section>
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
  cfmBtnColor,
  cfmBtnText,
  cancelBtnColor,
  cancelBtnText,
  dialogDelay,
  formatNumber,
} from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';
import PaginationComponent from 'src/components/PaginationComponent.vue';
import { User } from 'src/interfaces/user';
import { user_service } from 'src/services/user.service';
import { Role } from 'src/interfaces/role';
import { role_service } from 'src/services/role.service';
import { Permission } from 'src/interfaces/permission';
import { permission_service } from 'src/services/permission.service';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const formRef = ref<any>(null);
const authStore = useAuthStore();
const userService = user_service();
const roleService = role_service();
const permissionService = permission_service();

const dialog = ref<boolean>(false);
const dialog_permissions = ref<boolean>(false);
const isVisible = ref<boolean>(true);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const isAdmin = authStore.userAuth?.role === 'admin';
const pagination = ref<TablePagination>({
  page: 1,
  toPage: 1,
  rowsPerPage: 30,
  rowsNumber: 0,
});
const search = ref<string | null>(null);
const newPermissions = ref<number[]>([0]);
const permissions = ref<Permission[]>([]);
const roles = ref<Role[]>([]);
const users = ref<User[]>([]);
const user_model = ref<User>({
  id: null,
  username: '',
  email: null,
  phone: null,
  roleId: null,
  percent: null,
  userKey: null,
  callBackUrl: null,
  isEnable: true,
  userPermissions: [],
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'username', label: 'Username', field: 'username', sortable: true, align: 'left' as const },
  { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'left' as const },
  { name: 'phone', label: 'Phone', field: 'phone', sortable: true, align: 'left' as const },
  { name: 'roles', label: 'ສິດທີການໃຊ້ລະບົບ', field: 'roles.roleName', sortable: true, align: 'left' as const },
  {
    name: 'userPermissions',
    label: 'ສິດຈັດການລະບົບ',
    field: 'userPermissions.permissions',
    align: 'left' as const,
  },
  { name: 'callBackUrl', label: 'Call Back URL', field: 'callBackUrl', sortable: true, align: 'left' as const },
  { name: 'userKey', label: 'Key', field: 'userKey', sortable: true, align: 'left' as const },
  { name: 'percent', label: 'Percent', field: 'percent', sortable: true, align: 'left' as const },
  { name: 'balance', label: 'ຍອດເງິນ', field: 'balance', sortable: true, align: 'left' as const },
  { name: 'isEnable', label: 'ເປີດໃຊ້ງານ', field: 'isEnable', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const clearData = () => {
  dialog.value = false;
  dialog_permissions.value = false;
  newPermissions.value = [0];
  user_model.value = {
    id: null,
    username: '',
    email: null,
    phone: null,
    roleId: null,
    percent: null,
    userKey: null,
    callBackUrl: null,
    isEnable: true,
    userPermissions: [],
  };
};

const copyUserKey = async (userKey: string) => {
  await navigator.clipboard.writeText(userKey);
  $q.notify({
    message: 'Copy ສຳເລັດແລ້ວ',
    color: 'primary',
    icon: 'mdi-content-copy',
    timeout: dialogDelay,
    position: 'top',
  });
};

// Pagination component event handlers
const onRowsPerPageChange = async (value: number) => {
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  await getUsers(pagination.value);
};

const onFirstPage = async () => {
  pagination.value.page = 1;
  await getUsers(pagination.value);
};

const onPrevPage = async () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    await getUsers(pagination.value);
  }
};

const onNextPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  if (pagination.value.page < totalPages) {
    pagination.value.page++;
    await getUsers(pagination.value);
  }
};

const onLastPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  pagination.value.page = totalPages;
  await getUsers(pagination.value);
};

// Action handlers
const editUser = (user: User) => {
  dialog.value = true;
  user_model.value = { ...user };
};

const deleteUser = async (user: User) => {
  await Swal.fire({
    title: 'ລຶບຕົວແທນ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບຂໍ້ມູນຕົວແທນນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeleteUser(user.id!);
    }
  });
  clearData();
};

const onDeleteUser = async (user_id: number) => {
  await userService.deleteUser(user_id).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ລຶບຂໍ້ມູນຕົວແທນສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getUsers();
  });
};

const saveUser = async () => {
  try {
    // const isValid = await formRef.value.validate();
    // if (!isValid) {
    //   return;
    // }

    dialog.value = false;
    processing.value = true;
    user_model.value.percent = Number(user_model.value.percent);
    delete user_model.value.roles;

    if (user_model.value.id) {
      delete user_model.value.userPermissions;
      delete user_model.value.password;
      await updateUser();
    } else {
      await addUser();
    }

    clearData();
  } catch (error) {
    processing.value = false;
    dialog.value = false;
    await Swal.fire({
      title: 'ຜິດພາດ',
      text: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  }
};

const addUser = async () => {
  await userService.createUser(user_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getUsers();
  });
};

const updateUser = async () => {
  await userService.updateUser(user_model.value.id!, user_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ແກ້ໄຂຂໍ້ມູນຕົວແທນສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    void getUsers();
  });
};

const enableUser = async (val: User) => {
  await userService.updateUser(val.id!, { isEnable: val.isEnable }).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: val.isEnable ? 'ເປີດໃຊ້ງານສຳເລັດແລ້ວ' : 'ປິດໃຊ້ງານສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  });
};

const editUserPermissions = (user: User) => {
  dialog_permissions.value = true;
  newPermissions.value = user.userPermissions?.map((ups: any) => ups.permissions.id) ?? [0];
  user_model.value = user;
};

const updatePermissions = async (permissionId: number) => {
  try {
    if (user_model.value.userPermissions?.some((ups: any) => ups.permissions.id == permissionId) == false) {
      await userService.addUserPermissions(user_model.value.id!, permissionId).then((response) => {
        $q.notify({
          message: response.code == '201' ? 'ສຳເລັດ' : 'ຜິດພາດ',
          color: response.code == '201' ? 'primary' : 'negative',
          icon: 'mdi-check-circle-outline',
          timeout: dialogDelay,
          position: 'top',
        });
        if (response.code == '201') void getUsers();
      });
    } else {
      await userService.removeUserPermissions(user_model.value.id!, permissionId).then((response) => {
        $q.notify({
          message: response.code == '200' ? 'ສຳເລັດ' : 'ລະບົບຜິດພາດ',
          color: response.code == '200' ? 'primary' : 'negative',
          icon: 'mdi-check-circle-outline',
          timeout: dialogDelay,
          position: 'top',
        });
        if (response.code == '200') void getUsers();
      });
    }
  } catch (error) {
    clearData();
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  }
};

const getUsers = async (options?: TablePagination) => {
  loading.value = true;
  try {
    if (options && pagination.value.page == options.page && search.value == null) return;

    const response = await userService.getUsers({
      page: options?.page ?? null,
      limit: options?.rowsPerPage ?? null,
      search: search.value ?? null,
    });
    users.value = response.data;
    pagination.value.rowsNumber = response.total ?? 1;
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
};

const getRoles = async () => {
  const response = await roleService.getRoles();
  roles.value = response.data;
};

const getPermissions = async () => {
  const response = await permissionService.getPermissions();
  permissions.value = response.data;
};

const searchUser = async () => {
  await getUsers();
};

onMounted(async () => {
  void getRoles();
  void getPermissions();
  await getUsers();
});
</script>
