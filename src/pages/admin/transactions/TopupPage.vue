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
          @update:model-value="search && search.length == 0 ? searchTopup() : null"
        >
          <template v-slot:prepend>
            <q-btn icon="search" flat round color="primary" @click="searchTopup" />
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
                search = null;
                searchTopup();
              "
            />
          </template>
        </q-input>
      </div>
      <q-separator />
      <!-- Table data -->
      <q-table
        title="ຜູ້ໃຫ້ບໍລິການເກມ ແລະ Streaming"
        flat
        :rows="topups"
        :columns="columns"
        row-key="id"
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

        <template v-slot:body-cell-users="props">
          <q-td :props="props">
            <div>{{ props.row.users?.username }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.amount, 2) }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-oldBalance="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.oldBalance, 2) }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-newBalance="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.newBalance, 2) }}
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
            <q-btn
              outline
              round
              size="sm"
              color="negative"
              icon="delete"
              @click="deleteTopup(props.row)"
              :disable="!isAdmin"
            >
              <q-tooltip>ລຶບຂໍ້ມູນ</q-tooltip>
            </q-btn>
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
          <div class="text-subtitle1 text-bold">ແກ້ໄຂຜູ້ໃຫ້ບໍລິການເກມ ແລະ Streaming</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="clearData" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ຕົວແທນ</div>
            <q-select
              class="custom-input"
              outlined
              v-model="topup_model.uid"
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

            <div class="input-label">ຈຳນວນເງິນ</div>
            <q-input
              v-model="topup_model.amount"
              placeholder="ຈຳນວນເງິນ"
              outlined
              class="custom-input"
              clearable
              required
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ຈຳນວນເງິນ', (val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>
            <div class="input-label">ຄຳອະທິບາຍ</div>
            <q-input v-model="topup_model.description" placeholder="ຄຳອະທິບາຍ" outlined class="custom-input" clearable>
              <template v-slot:prepend>
                <q-icon name="mdi-list-box" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm" @click="clearData" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm" @click="saveTopup" />
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
import { Topup } from 'src/interfaces/topup';
import { User } from 'src/interfaces/user';
import { user_service } from 'src/services/user.service';
import { topup_service } from 'src/services/topup.service';

const formRef = ref<any>(null);
const authStore = useAuthStore();
const userService = user_service();
const topupService = topup_service();

const dialog = ref<boolean>(false);
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
const users = ref<User[]>([]);
const topups = ref<Topup[]>([]);
const topup_model = ref<Topup>({
  id: null,
  uid: null,
  amount: null,
  description: null,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'users', label: 'ຕົວແທນ', field: 'users', sortable: true, align: 'left' as const },
  { name: 'amount', label: 'ຈຳນວນເງິນ', field: 'amount', sortable: true, align: 'left' as const },
  { name: 'oldBalance', label: 'ຍອດເງິນກ່ອນ', field: 'oldBalance', sortable: true, align: 'left' as const },
  { name: 'newBalance', label: 'ຍອດເງິນຫລັງ', field: 'newBalance', sortable: true, align: 'left' as const },
  { name: 'description', label: 'ຄຳອະທິບາຍ', field: 'description', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const clearData = () => {
  dialog.value = false;
  topup_model.value = {
    id: null,
    uid: null,
    amount: null,
    description: null,
  };
};

// Pagination component event handlers
const onRowsPerPageChange = async (value: number) => {
  if (pagination.value.rowsPerPage == value) return;
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  await getTopups(pagination.value);
};

const onFirstPage = async () => {
  pagination.value.page = 1;
  await getTopups(pagination.value);
};

const onPrevPage = async () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    await getTopups(pagination.value);
  }
};

const onNextPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  if (pagination.value.page < totalPages) {
    pagination.value.page++;
    await getTopups(pagination.value);
  }
};

const onLastPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  pagination.value.page = totalPages;
  await getTopups(pagination.value);
};

// Action handlers
const editTopup = (topup: Topup) => {
  dialog.value = true;
  topup_model.value = { ...topup };
};

const deleteTopup = async (topup: Topup) => {
  await Swal.fire({
    title: 'ລຶບຂໍ້ມູນການເຕີ່ມເງິນ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບຂໍ້ມູນການເຕີ່ມເງິນນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeleteTopup(topup.id!);
    }
  });
  clearData();
};

const onDeleteTopup = async (topup_id: number) => {
  await topupService.deleteTopup(topup_id).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ລຶບຂໍ້ມູນການເຕີ່ມເງິນສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getTopups();
  });
};

const saveTopup = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    delete topup_model.value.users;
    topup_model.value.amount = Number(topup_model.value.amount);

    // if (topup_model.value.id) {
    //   await updateTopup();
    // } else {
    await addTopup();
    // }

    clearData();
  } catch (error) {
    processing.value = false;
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      confirmButtonColor: cfmBtnColor,
    });
  }
};

const addTopup = async () => {
  await topupService.createTopup(topup_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກຂໍ້ມູນການເຕີ່ມເງິນສຳເລັດແລ້ວ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getTopups();
  });
};

// const updateTopup = async () => {
//   await topupService.updateTopup(topup_model.value.id!, topup_model.value).then(async (response) => {
//     processing.value = false;
//     await Swal.fire({
//       title: 'ສຳເລັດ',
//       text: 'ແກ້ໄຂຂໍ້ມູນການເຕີ່ມເງິນສຳເລັດແລ້ວ',
//       icon: response.code == '200' ? 'success' : 'error',
//       timer: dialogDelay,
//       confirmButtonColor: cfmBtnColor,
//     });
//     void getTopups();
//   });
// };

const getTopups = async (options?: TablePagination) => {
  loading.value = true;
  try {
    const response = await topupService.getTopups({
      page: options?.page ?? null,
      limit: options?.rowsPerPage ?? null,
      search: search.value ?? null,
    });
    topups.value = response.data;
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

const searchTopup = async () => {
  await getTopups(pagination.value);
};

const getUsers = async () => {
  const response = await userService.getUsers();
  users.value = response.data;
};

onMounted(async () => {
  void getUsers();
  await getTopups();
});
</script>
