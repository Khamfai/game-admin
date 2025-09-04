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
          @update:model-value="search && search.length == 0 ? searchProvider() : null"
        >
          <template v-slot:prepend>
            <q-btn icon="search" flat round color="primary" @click="searchProvider" />
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
                searchProvider();
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
        :rows="providers"
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

        <template v-slot:body-cell-balance="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.balance, 2) }} {{ props.row.curr }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-increment="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.increment) }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-excRate="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.excRate, 3) }}
            </div>
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
                @update:model-value="enableProvider(props.row)"
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
            <div class="row items-center justify-around" style="width: 100px">
              <q-btn
                outline
                round
                size="sm"
                color="primary"
                icon="edit"
                @click="editProvider(props.row)"
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
                @click="deleteProvider(props.row)"
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
          <div class="text-subtitle1 text-bold">ແກ້ໄຂຜູ້ໃຫ້ບໍລິການເກມ ແລະ Streaming</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="clearData" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ຜູ້ໃຫ້ບໍລິການ</div>
            <q-input
              v-model="provider_model.name"
              placeholder="ຜູ້ໃຫ້ບໍລິການ"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ຜູ້ໃຫ້ບໍລິການ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-account-circle" />
              </template>
            </q-input>

            <div class="input-label">API URL</div>
            <q-input
              v-model="provider_model.url"
              placeholder="API URL"
              outlined
              class="custom-input"
              clearable
              required
              :rules="[
                (val) => val.length > 0 || 'ກະລຸນາໃສ່ API URL',
                (val) => /^https?:\/\/.+/.test(val) || 'ກະລຸນາໃສ່ URL ທີ່ຖືກຕ້ອງ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-link" />
              </template>
            </q-input>

            <div class="input-label">API Key</div>
            <q-input
              v-model="provider_model.apiKey"
              placeholder="API Key"
              outlined
              class="custom-input"
              clearable
              required
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ API Key']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-key" />
              </template>
            </q-input>

            <div class="input-label">Call Back URL</div>
            <q-input
              v-model="provider_model.callBackUrl"
              placeholder="Call Back URL"
              outlined
              class="custom-input"
              clearable
              :rules="[(val) => /^https?:\/\/.+/.test(val) || 'ກະລຸນາໃສ່ URL ທີ່ຖືກຕ້ອງ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-link" />
              </template>
            </q-input>
            <div class="input-label">ສະກຸນເງິນ</div>
            <q-input
              v-model="provider_model.curr"
              placeholder="ສະກຸນເງິນ"
              outlined
              class="custom-input"
              clearable
              required
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ສະກຸນເງິນ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>
            <div class="row" style="display: flex; flex-direction: row">
              <div class="col-6">
                <div class="input-label">ມູນຄ່າເພີ່ມ</div>
                <q-input
                  v-model="provider_model.increment"
                  placeholder="ມູນຄ່າເພີ່ມ"
                  outlined
                  class="custom-input"
                  clearable
                  type="number"
                  style="margin-right: 5px"
                  :rules="[(val) => val >= 0 || 'ມູນຄ່າເພີ່ມຕ້ອງໃຫຍ່ກວ່າຫຼືເທົ່າກັບ 0']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-plus" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-6">
                <div class="input-label" style="margin-left: 5px">ອັດຕາແລກປ່ຽນ</div>
                <q-input
                  v-model="provider_model.excRate"
                  placeholder="ອັດຕາແລກປ່ຽນ"
                  style="margin-left: 5px"
                  outlined
                  class="custom-input"
                  clearable
                  type="number"
                  required
                  :rules="[
                    (val) => val > 0 || 'ອັດຕາແລກປ່ຽນຕ້ອງໃຫຍ່ກວ່າ 0',
                    (val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ',
                  ]"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-cash-multiple" />
                  </template>
                </q-input>
              </div>
            </div>
            <q-toggle
              v-model="provider_model.isEnable"
              checked-icon="check"
              unchecked-icon="clear"
              color="primary"
              label="ເປີດໃຊ້ງານ"
              @update:model-value="enableProvider(provider_model)"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm" @click="clearData" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm" @click="saveProvider" />
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
import { Provider } from 'src/interfaces/provider';
import { provider_service } from 'src/services/provider.service';
import PaginationComponent from 'src/components/PaginationComponent.vue';

const formRef = ref<any>(null);
const authStore = useAuthStore();
const providerService = provider_service();

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
const providers = ref<Provider[]>([]);
const provider_model = ref<Provider>({
  id: null,
  name: '',
  url: '',
  apiKey: '',
  callBackUrl: null,
  increment: 0,
  excRate: 1,
  curr: null,
  isEnable: true,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'name', label: 'ຜູ້ໃຫ້ບໍລິການ', field: 'name', sortable: true, align: 'left' as const },
  { name: 'url', label: 'URL', field: 'url', sortable: true, align: 'left' as const },
  { name: 'apiKey', label: 'API Key', field: 'apiKey', sortable: true, align: 'left' as const },
  { name: 'balance', label: 'ຍອດເງິນ', field: 'balance', sortable: true, align: 'left' as const },
  { name: 'callBackUrl', label: 'Call Back URL', field: 'callBackUrl', sortable: true, align: 'left' as const },
  { name: 'increment', label: 'ມູນຄ່າເພີ່ມ', field: 'increment', sortable: true, align: 'left' as const },
  { name: 'excRate', label: 'ອັດຕາແລກປ່ຽນ', field: 'excRate', sortable: true, align: 'left' as const },
  { name: 'curr', label: 'ສະກຸນເງິນ', field: 'curr', sortable: true, align: 'left' as const },
  { name: 'isEnable', label: 'ເປີດໃຊ້ງານ', field: 'isEnable', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const clearData = () => {
  dialog.value = false;
  provider_model.value = {
    id: null,
    name: '',
    url: '',
    apiKey: '',
    callBackUrl: null,
    increment: 0,
    excRate: 1,
    curr: null,
    isEnable: true,
  };
};

// Pagination component event handlers
const onRowsPerPageChange = async (value: number) => {
  if (pagination.value.rowsPerPage == value) return;
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  await getProviders(pagination.value);
};

const onFirstPage = async () => {
  pagination.value.page = 1;
  await getProviders(pagination.value);
};

const onPrevPage = async () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    await getProviders(pagination.value);
  }
};

const onNextPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  if (pagination.value.page < totalPages) {
    pagination.value.page++;
    await getProviders(pagination.value);
  }
};

const onLastPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  pagination.value.page = totalPages;
  await getProviders(pagination.value);
};

// Action handlers
const editProvider = (provider: Provider) => {
  dialog.value = true;
  provider_model.value = { ...provider };
};

const deleteProvider = async (provider: Provider) => {
  await Swal.fire({
    title: 'ລຶບຜູ້ໃຫ້ບໍລິການ',
    icon: 'warning',
    text: 'ຕ້ອງການລຶບຂໍ້ມູນຜູ້ໃຫ້ບໍລິການນີ້ຫຼືບໍ່?',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonColor: cfmBtnColor,
    cancelButtonColor: cancelBtnColor,
    confirmButtonText: cfmBtnText,
    cancelButtonText: cancelBtnText,
  }).then(async (result) => {
    if (result.isConfirmed) {
      await onDeleteProvider(provider.id!);
    }
  });
  clearData();
};

const onDeleteProvider = async (provider_id: number) => {
  await providerService.deleteProvider(provider_id).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ລຶບຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getProviders();
  });
};

const saveProvider = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    provider_model.value.excRate = Number(provider_model.value.excRate);
    if (provider_model.value.increment != null) provider_model.value.increment = Number(provider_model.value.increment);
    if (provider_model.value.balance != null) delete provider_model.value.balance;

    if (provider_model.value.id) {
      await updateProvider();
    } else {
      await addProvider();
    }

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

const addProvider = async () => {
  await providerService.createProvider(provider_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getProviders();
  });
};

const updateProvider = async () => {
  await providerService.updateProvider(provider_model.value.id!, provider_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    void getProviders();
  });
};

const enableProvider = async (val: Provider) => {
  await providerService.updateProvider(val.id!, { isEnable: val.isEnable }).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: val.isEnable ? 'ເປີດໃຊ້ງານສຳເລັດແລ້ວ' : 'ປິດໃຊ້ງານສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  });
};

const getProviders = async (options?: TablePagination) => {
  loading.value = true;
  try {
    const response = await providerService.getProviders({
      page: options?.page ?? null,
      limit: options?.rowsPerPage ?? null,
      search: search.value ?? null,
    });
    providers.value = response.data;
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

const searchProvider = async () => {
  await getProviders(pagination.value);
};

onMounted(async () => {
  await getProviders();
});
</script>
