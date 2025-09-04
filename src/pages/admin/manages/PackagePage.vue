<template>
  <q-page class="q-pa-md">
    <div class="row cus-card-table">
      <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12" style="padding: 12px">
        <q-input
          v-model="search"
          placeholder="ຄົ້ນຫາ"
          class="custom-input"
          outlined
          rounded
          @keyup.enter="searchPackage()"
          @update:model-value="search && search.length == 0 ? searchPackage() : null"
        >
          <template v-slot:prepend>
            <q-btn icon="search" flat round color="primary" @click="searchPackage" />
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
                searchPackage();
              "
            />
          </template>
        </q-input>
      </div>
      <q-separator />
      <!-- Table data -->
      <q-table
        title="Package"
        flat
        :rows="packages"
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
        <template v-slot:body-cell-games="props">
          <q-td :props="props">
            <div>
              {{ props.row.games.name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-providers="props">
          <q-td :props="props">
            <div>
              {{ props.row.providers.name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-sourcePrice="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.sourcePrice) }} {{ props.row.providers.curr }}</div>
          </q-td>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">
            <div>{{ formatNumber(props.row.price) }} LAK</div>
          </q-td>
        </template>
        <template v-slot:body-cell-quantity="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.quantity, 0) }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-discount="props">
          <q-td :props="props">
            <div>
              {{ formatNumber(props.row.discount, 3) }}
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
                @update:model-value="enablePackage(props.row)"
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
            <div class="row items-center justify-around" style="width: 150px">
              <q-btn
                outline
                round
                size="sm"
                color="primary"
                icon="mdi-dots-horizontal"
                @click="goSpacialPackage(props.row)"
                :disable="!isAdmin"
              ></q-btn>
              <q-btn
                icon="mdi-translate"
                outline
                round
                size="sm"
                color="primary"
                :disable="!isAdmin"
                @click="translatePackage(props.row)"
              ></q-btn>

              <q-btn outline round size="sm" color="primary" icon="edit" @click="editPackage(props.row)" :disable="!isAdmin">
                <q-tooltip>ແກ້ໄຂຂໍ້ມູນ</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="deletePackage(props.row)"
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
            :rows-per-page-options="[10, 30, 50, 100, 200]"
            rows-per-page-label="ຈຳນວນຕໍ່ຫນ້າ"
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
          <div class="text-subtitle1 text-bold">ແກ້ໄຂຂໍ້ມູນ Package</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="clearData" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">Package</div>
            <q-input
              v-model="package_model.packageName"
              placeholder="Package"
              class="custom-input"
              outlined
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ Package']"
            >
              <template v-slot:prepend>
                <q-icon name="token" />
              </template>
            </q-input>

            <div class="input-label">Source ID</div>
            <q-input
              v-model="package_model.sourceId"
              placeholder="Source ID"
              class="custom-input"
              outlined
              clearable
              required
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ Source ID']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-numeric" />
              </template>
            </q-input>

            <div class="input-label">ລາຄາຜູ້ໃຫ້ບໍລິການ</div>
            <q-input
              v-model="package_model.sourcePrice"
              placeholder="ລາຄາຜູ້ໃຫ້ບໍລິການ"
              class="custom-input"
              type="number"
              outlined
              clearable
              required
              :rules="[
                (val) => val.length > 0 || 'ກະລຸນາໃສ່ລາຄາຜູ້ໃຫ້ບໍລິການ',
                (val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>

            <div class="input-label">ລາຄາຕົ້ນທືນ</div>
            <q-input
              v-model="package_model.price"
              placeholder="ລາຄາຕົ້ນທືນ"
              class="custom-input"
              type="number"
              outlined
              clearable
              required
              :rules="[
                (val) => val.length > 0 || 'ກະລຸນາໃສ່ລາຄາຕົ້ນທືນ',
                (val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-cash" />
              </template>
            </q-input>

            <div class="row" style="display: flex; flex-direction: row">
              <div class="col-6">
                <div class="input-label">ຈຳນວນ</div>
                <q-input
                  v-model="package_model.quantity"
                  placeholder="ຈຳນວນ"
                  class="custom-input"
                  outlined
                  clearable
                  type="number"
                  style="margin-right: 5px"
                  :rules="[(val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-numeric" />
                  </template>
                </q-input>
              </div>
              <q-space />
              <div class="col-6">
                <div class="input-label" style="margin-left: 5px">ສ່ວນຫຼຸດ</div>
                <q-input
                  v-model="package_model.discount"
                  placeholder="ສ່ວນຫຼຸດ"
                  style="margin-left: 5px"
                  class="custom-input"
                  outlined
                  clearable
                  type="number"
                  :rules="[(val) => !isNaN(val) || 'ກະລຸນາໃສ່ຕົວເລກທີ່ຖືກຕ້ອງ']"
                >
                  <template v-slot:prepend>
                    <q-icon name="mdi-percent" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="input-label">ຜູ້ໃຫ້ບໍລິການ</div>
            <q-select
              class="custom-input"
              outlined
              v-model="package_model.providerId"
              :options="providers"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              required
              clearable
              @update:model-value="getGames(package_model.providerId)"
              :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ຜູ້ໃຫ້ບໍລິການ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-handshake" />
              </template>
            </q-select>
            <div class="input-label">ເລືອກເກມ ຫຼື Streamming</div>
            <q-select
              v-model="package_model.gameId"
              :options="gameOptions"
              class="custom-input"
              outlined
              option-value="id"
              option-label="name"
              emit-value
              map-options
              required
              clearable
              use-input
              input-debounce="0"
              @filter="filterGames"
              :loading="gameLoading"
              :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ເກມ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-controller" />
              </template>
            </q-select>

            <q-toggle
              v-model="package_model.isEnable"
              checked-icon="check"
              style="margin-top: 10px"
              unchecked-icon="clear"
              color="primary"
              label="ເປີດໃຊ້ງານ"
              @update:model-value="enablePackage(package_model)"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm" @click="clearData" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm" @click="savePackage" />
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
import { Package } from 'src/interfaces/package';
import { package_service } from 'src/services/package.service';
import { provider_service } from 'src/services/provider.service';
import { game_service } from 'src/services/game.service';
import { Provider } from 'src/interfaces/provider';
import { Game } from 'src/interfaces/game';
import { QSelect } from 'quasar';
import { useRouter } from 'vue-router';
import { usePackageStore } from 'src/stores/package-store';

const router = useRouter();
const formRef = ref<any>(null);
const authStore = useAuthStore();
const packageStore = usePackageStore();
const packageService = package_service();
const providerService = provider_service();
const gameService = game_service();

const dialog = ref<boolean>(false);
const gameLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const processing = ref<boolean>(false);
const isAdmin = authStore.userAuth?.role === 'admin';
const pagination = ref<TablePagination>({
  page: 1,
  toPage: 1,
  rowsPerPage: 30,
  rowsNumber: 0,
});
// const gameTotal = ref<number>(0);
// const nextPage = ref<number>(50);

const search = ref<string | null>(null);
const providers = ref<Provider[]>([]);
const games = ref<Game[]>([]);
const gameOptions = ref<Game[]>([]);
const packages = ref<Package[]>([]);
const package_model = ref<Package>({
  providerId: null,
  gameId: null,
  sourceId: '',
  packageName: '',
  sourcePrice: 0,
  price: 0,
  isEnable: true,
  description: null,
  otp_path: null,
  quantity: null,
  discount: null,
  image: null,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'packageName', label: 'Package', field: 'packageName', sortable: true, align: 'left' as const },
  { name: 'games', label: 'ເກມ', field: 'games.name', sortable: true, align: 'left' as const },
  { name: 'providers', label: 'ຜູ້ໃຫ້ບໍລິການ', field: 'providers.name', sortable: true, align: 'left' as const },
  { name: 'sourcePrice', label: 'ລາຄາຜູ້ໃຫ້ບໍລິການ', field: 'sourcePrice', sortable: true, align: 'left' as const },
  { name: 'price', label: 'ລາຄາຂອງລະບົບ', field: 'price', sortable: true, align: 'left' as const },
  { name: 'quantity', label: 'ຈຳນວນ', field: 'quantity', sortable: true, align: 'center' as const },
  { name: 'discount', label: 'ສ່ວນຫຼຸດ', field: 'discount', sortable: true, align: 'left' as const },
  { name: 'isEnable', label: 'ເປີດໃຊ້ງານ', field: 'isEnable', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const goSpacialPackage = async (packageData: Package) => {
  packageStore.setPackage(packageData);
  await router.push({ path: `/admin/spacial-package/${packageData.id}` });
};

const clearData = () => {
  dialog.value = false;
  package_model.value = {
    providerId: null,
    gameId: null,
    sourceId: '',
    packageName: '',
    sourcePrice: 0,
    price: 0,
    isEnable: true,
    description: null,
    otp_path: null,
    quantity: null,
    discount: null,
    image: null,
  };
};

// Pagination component event handlers
const onRowsPerPageChange = async (value: number) => {
  if (pagination.value.rowsPerPage == value) return;
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  await getPackages(pagination.value);
};

const onFirstPage = async () => {
  pagination.value.page = 1;
  await getPackages(pagination.value);
};

const onPrevPage = async () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    await getPackages(pagination.value);
  }
};

const onNextPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  if (pagination.value.page < totalPages) {
    pagination.value.page++;
    await getPackages(pagination.value);
  }
};

const onLastPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  pagination.value.page = totalPages;
  await getPackages(pagination.value);
};

// Action handlers
const editPackage = (packageData: Package) => {
  void getGames(packageData.providerId);
  package_model.value = { ...packageData };
  delete package_model.value._count;
  delete package_model.value.games;
  delete package_model.value.providers;
  dialog.value = true;
};

const deletePackage = async (packageData: Package) => {
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
      await onDeletePackage(packageData.id!);
    }
  });
  clearData();
};

const onDeletePackage = async (package_id: number) => {
  await packageService.deletePackage(package_id).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ລຶບຂໍ້ມູນສິດທີການໃຊ້ລະບົບສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getPackages(pagination.value);
  });
};

const savePackage = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    package_model.value.sourcePrice = Number(package_model.value.sourcePrice);
    package_model.value.price = Number(package_model.value.price);
    package_model.value.quantity = package_model.value.quantity ? Number(package_model.value.quantity) : null;
    package_model.value.discount = package_model.value.discount ? Number(package_model.value.discount) : null;

    if (package_model.value.id) {
      await updatePackage();
    } else {
      await addPackage();
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

const addPackage = async () => {
  await packageService.createPackage(package_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getPackages(pagination.value);
  });
};

const updatePackage = async () => {
  await packageService.updatePackage(package_model.value.id!, package_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    void getPackages(pagination.value);
  });
};

const translatePackage = async (val: Package) => {
  try {
    processing.value = true;
    await packageService.translatePackage(val.id!).then(async (response) => {
      processing.value = false;
      await Swal.fire({
        title: 'ສຳເລັດ',
        text: 'ແປກຂໍ້ມູນສຳເລັດແລ້ວ',
        icon: response.code == '200' ? 'success' : 'error',
        timer: dialogDelay,
        confirmButtonColor: cfmBtnColor,
      });
      void getPackages(pagination.value);
    });
  } catch (error) {
    processing.value = false;
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  }
};

const enablePackage = async (val: Package) => {
  await packageService.updatePackage(val.id!, { isEnable: val.isEnable }).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: val.isEnable ? 'ເປີດໃຊ້ງານສຳເລັດແລ້ວ' : 'ປິດໃຊ້ງານສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  });
};

const getPackages = async (options?: TablePagination) => {
  loading.value = true;
  try {
    const response = await packageService.getPackages({
      page: options?.page ?? null,
      limit: options?.rowsPerPage ?? null,
      search: search.value ?? null,
    });
    packages.value = response.data;
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

const searchPackage = async () => {
  loading.value = true;
  await getPackages(pagination.value);
  loading.value = false;
};

const getProviders = async () => {
  const response = await providerService.getProviders();
  providers.value = response.data;
};

const getGames = async (providerId: number | null) => {
  if (!providerId) return;
  try {
    gameLoading.value = true;
    const response = await gameService.getGamesByProvider(providerId);
    games.value = response.data;
    gameOptions.value = games.value;
    gameLoading.value = false;
  } catch (error) {
    gameLoading.value = false;
    await Swal.fire({
      title: (error as Error).message,
      icon: 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  }
};

const filterGames = (val: string, update: (val: () => void) => void) => {
  update(() => {
    if (val === '') {
      update(() => {
        gameOptions.value = games.value;
      });
      return;
    }

    const needle = val.toLowerCase();
    gameOptions.value = games.value.filter((v) => v.name?.toLowerCase().includes(needle));
  });
};

onMounted(async () => {
  try {
    loading.value = true;
    void getProviders();
    await getPackages(pagination.value);
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
