<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <div class="col-md-4 col-sm-6 col-xs-12" style="padding: 12px">
        <q-input v-model="search" placeholder="ຄົ້ນຫາ" outlined rounded dense clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
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
        row-key="roleName"
        class="full-width"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        @update:pagination="getProviders($event)"
        :loading="loading"
      >
        <template v-slot:top-right>
          <q-btn color="secondary" outline round icon="add" size="sm" @click="dialog = true" />
        </template>

        <template v-slot:body-cell-isEnable="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-toggle
                v-model="props.row.isEnable"
                checked-icon="check"
                unchecked-icon="clear"
                color="secondary"
                label="ເປີດໃຊ້ງານ"
                @update:model-value="enableProvider(props.row)"
              />
            </div>
          </q-td>
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
          <q-td :props="props">
            <div class="row items-center justify-around" style="width: 100px">
              <q-btn
                outline
                round
                size="sm"
                color="secondary"
                icon="edit"
                @click="editProvider(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ແກ້ໄຂສິດທີ</q-tooltip>
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
                <q-tooltip>ລຶບສິດທີ</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog" persistent>
      <q-card style="max-width: 600px; width: 100%; border-radius: var(--rounded-md)">
        <q-card-section class="row items-center">
          <div class="text-subtitle1 text-bold">ແກ້ໄຂຜູ້ໃຫ້ບໍລິການເກມ ແລະ Streaming</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="colseAddDialog" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ຜູ້ໃຫ້ບໍລິການ</div>
            <q-input
              v-model="provider_model.name"
              placeholder="ຜູ້ໃຫ້ບໍລິການ"
              outlined
              rounded
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
              rounded
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
              rounded
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
              rounded
              clearable
              required
              :rules="[
                (val) => val.length > 0 || 'ກະລຸນາໃສ່ Call Back URL',
                (val) => /^https?:\/\/.+/.test(val) || 'ກະລຸນາໃສ່ URL ທີ່ຖືກຕ້ອງ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-link" />
              </template>
            </q-input>

            <div class="row" style="display: flex; flex-direction: row">
              <div class="col-6">
                <div class="input-label">ມູນຄ່າເພີ່ມ</div>
                <q-input
                  v-model="provider_model.increment"
                  placeholder="ມູນຄ່າເພີ່ມ"
                  outlined
                  rounded
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
                  rounded
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
              color="secondary"
              label="ເປີດໃຊ້ງານ"
              @update:model-value="enableProvider(provider_model)"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm" @click="colseAddDialog" />
          <q-btn label="ບັນທຶກ" color="secondary" class="border-rounded-sm" @click="saveProvider" />
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
import { formatDate, cfmBtnColor, cfmBtnText, cancelBtnColor, cancelBtnText, dialogDelay } from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';
import { Provider } from 'src/interfaces/provider';
import { provider_service } from 'src/services/provider.service';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const formRef = ref<any>(null);
const authStore = useAuthStore();
const providerService = provider_service();
const dialog = ref<boolean>(false);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const isAdmin = authStore.userAuth?.role === 'admin';
const pagination = ref<TablePagination>({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 1,
});
const search = ref<string>('');
const providers = ref<Provider[]>([]);
const provider_model = ref<Provider>({
  id: null,
  name: '',
  url: '',
  apiKey: '',
  callBackUrl: null,
  increment: 0,
  excRate: 1,
  isEnable: true,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'name', label: 'ສິດທີການໃຊ້ລະບົບ', field: 'name', sortable: true, align: 'left' as const },
  { name: 'url', label: 'URL', field: 'url', sortable: true, align: 'left' as const },
  { name: 'apiKey', label: 'API Key', field: 'apiKey', sortable: true, align: 'left' as const },
  { name: 'balance', label: 'ຍອດເງິນ', field: 'balance', sortable: true, align: 'left' as const },
  { name: 'callBackUrl', label: 'Call Back URL', field: 'callBackUrl', sortable: true, align: 'left' as const },
  { name: 'increment', label: 'ມູນຄ່າເພີ່ມ', field: 'increment', sortable: true, align: 'left' as const },
  { name: 'excRate', label: 'ອັດຕາແລກປ່ຽນ', field: 'excRate', sortable: true, align: 'left' as const },
  { name: 'isEnable', label: 'ເປີດໃຊ້ງານ', field: 'isEnable', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const colseAddDialog = () => {
  dialog.value = false;
  provider_model.value = {
    id: null,
    name: '',
    url: '',
    apiKey: '',
    callBackUrl: null,
    increment: 0,
    excRate: 1,
    isEnable: true,
  };
};

// Action handlers
const editProvider = (provider: Provider) => {
  dialog.value = true;
  provider_model.value = provider;
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
  provider_model.value = {
    id: null,
    name: '',
    url: '',
    apiKey: '',
    callBackUrl: null,
    increment: 0,
    excRate: 1,
    isEnable: true,
  };
};

const onDeleteProvider = async (provider_id: number) => {
  await providerService.deleteProvider(provider_id).then(async (response) => {
    await Swal.fire({
      title: response.message,
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
    if (provider_model.value.balance != null) provider_model.value.balance = Number(provider_model.value.balance);

    if (provider_model.value.id) {
      await updateProvider();
    } else {
      await addProvider();
    }

    provider_model.value = {
      id: null,
      name: '',
      url: '',
      apiKey: '',
      callBackUrl: '',
      increment: 0,
      excRate: 1,
      isEnable: true,
    };
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
      text: 'ບັນທຶກສຳເລັດ',
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
      text: 'ແກ້ໄຂສຳເລັດ',
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

const getProviders = async (options?: { page: number; rowsPerPage: number }) => {
  if (options && pagination.value.page == options.page) return;

  const response = await providerService.getProviders();
  providers.value = response.data;
  pagination.value.rowsNumber = response.total ?? 1;
};

onMounted(async () => {
  try {
    loading.value = true;
    await getProviders();
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
