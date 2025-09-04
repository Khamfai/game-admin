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
          @keyup.enter="searchGame()"
          @update:model-value="search.length == 0 ? searchGame() : null"
        >
          <template v-slot:prepend>
            <q-btn icon="search" flat round color="primary" @click="searchGame" />
          </template>

          <template v-if="search.length > 0" v-slot:append>
            <q-btn
              icon="close"
              unelevated
              round
              size="sm"
              color="grey-4"
              text-color="black"
              @click="
                search = '';
                searchGame();
              "
            />
          </template>
        </q-input>
      </div>
      <q-separator />
      <!-- Table data -->
      <q-table
        title="ບໍລິການເກມ"
        flat
        :rows="games"
        :columns="columns"
        row-key="name"
        class="full-width"
        :pagination="{
          rowsPerPage: pagination.rowsPerPage,
        }"
        rows-per-page-label="ຈຳນວນຕໍ່ຫນ້າ"
        @update:pagination="paginationChange($event)"
        :sort-by="pagination.sortBy"
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
        <template v-slot:body-cell-count="props">
          <q-td :props="props">
            <div>
              {{ props.row._count.packages }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-provider="props">
          <q-td :props="props">
            <div>
              {{ props.row.providers.name }}
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
                @update:model-value="enableGame(props.row)"
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
              <q-btn outline round size="sm" color="primary" icon="edit" @click="editGame(props.row)" :disable="!isAdmin">
                <q-tooltip>ແກ້ໄຂສິດທີ</q-tooltip>
              </q-btn>
              <q-btn
                outline
                round
                size="sm"
                color="negative"
                icon="delete"
                @click="deleteGame(props.row)"
                :disable="!isAdmin"
              >
                <q-tooltip>ລຶບສິດທີ</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>

        <template v-slot:bottom>
          <q-space />
          <PaginationComponent
            :pagination="pagination"
            :rows-per-page-options="[10, 30, 50, 100]"
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
          <div class="text-subtitle1 text-bold">ແກ້ໄຂບໍລິການ</div>
          <q-space />
          <q-btn outline round size="sm" color="negative" icon="close" @click="colseAddDialog" />
        </q-card-section>
        <q-card-section>
          <q-form ref="formRef">
            <div class="input-label">ຊື່ເກມ</div>
            <q-input
              v-model="game_model.name"
              class="custom-input"
              placeholder="ຊື່ເກມ"
              outlined
              clearable
              required
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ຊື່ເກມ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-gamepad-variant" />
              </template>
            </q-input>

            <div class="input-label">ເລກເກມ</div>
            <q-input
              v-model="game_model.sourceId"
              class="custom-input"
              placeholder="ເລກເກມ"
              outlined
              clearable
              style="margin-bottom: 20px"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-numeric" />
              </template>
            </q-input>

            <div class="input-label">Service Code</div>
            <q-input
              v-model="game_model.serviceCode"
              class="custom-input"
              placeholder="Service Code"
              outlined
              clearable
              style="margin-bottom: 20px"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-code-json" />
              </template>
            </q-input>

            <div class="input-label">ປະເພດເກມ</div>
            <q-select
              v-model="game_model.type"
              class="custom-input"
              outlined
              :options="gameTypes"
              :option-value="($option) => $option"
              :option-label="($option) => $option"
              emit-value
              map-options
              required
              fill-input
              clearable
              :rules="[(val) => val.length > 0 || 'ກະລຸນາໃສ່ປະເພດເກມ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-format-list-bulleted-type" />
              </template>
            </q-select>

            <div class="input-label">ຜູ້ໃຫ້ບໍລິການ</div>
            <q-select
              class="custom-input"
              outlined
              v-model="game_model.providerId"
              :options="providers"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              required
              fill-input
              clearable
              :rules="[(val) => val !== null || 'ກະລຸນາໃສ່ຜູ້ໃຫ້ບໍລິການ']"
            >
              <template v-slot:prepend>
                <q-icon name="mdi-handshake" />
              </template>
            </q-select>

            <q-toggle
              v-model="game_model.isEnable"
              style="margin-top: 10px"
              checked-icon="check"
              unchecked-icon="clear"
              color="primary"
              label="ເປີດໃຊ້ງານ"
              @update:model-value="enableGame(game_model)"
            />
          </q-form>
        </q-card-section>
        <q-card-actions align="right" style="padding: 20px 10px">
          <q-btn label="ຍົກເລີກ" outline color="negative" class="border-rounded-sm custom-btn" @click="colseAddDialog" />
          <q-btn label="ບັນທຶກ" color="primary" class="border-rounded-sm custom-btn" @click="saveGame" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="processing" persistent width="100%" height="100%">
      <q-circular-progress v-if="processing" indeterminate size="100px" :thickness="0.15" color="primary" />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { formatDate, cfmBtnColor, cfmBtnText, cancelBtnColor, cancelBtnText, dialogDelay } from 'src/utils/utils';
import { useAuthStore } from 'src/stores/auth-store';
import { Pagination, TablePagination } from 'src/interfaces/pagination';
import Swal from 'sweetalert2';
import { game_service } from 'src/services/game.service';
import { Game } from 'src/interfaces/game';
import { Provider } from 'src/interfaces/provider';
import { provider_service } from 'src/services/provider.service';
import PaginationComponent from 'src/components/PaginationComponent.vue';

const formRef = ref<any>(null);
const authStore = useAuthStore();
const gameService = game_service();
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
const search = ref<string>('');
const gameTypes = ref<string[]>([]);
const providers = ref<Provider[]>([]);
const games = ref<Game[]>([]);
const game_model = ref<Game>({
  id: null,
  name: '',
  sourceId: '',
  providerId: null,
  image: null,
  type: '',
  serviceCode: null,
  isEnable: true,
});
const columns = ref([
  // { name: 'id', label: 'ID', field: 'id', sortable: true, align: 'center' as const },
  { name: 'name', label: 'ຊື່ເກມ', field: 'name', sortable: true, align: 'left' as const },
  { name: 'sourceId', label: 'ເລກເກມ', field: 'sourceId', sortable: true, align: 'left' as const },
  { name: 'serviceCode', label: 'Service Code', field: 'serviceCode', sortable: true, align: 'left' as const },
  { name: 'count', label: 'ຈຳນວນ Package', field: '_count.packages', sortable: true, align: 'center' as const },
  { name: 'provider', label: 'ຜູ້ໃຫ້ບໍລິການ', field: 'providers.name', sortable: true, align: 'left' as const },
  { name: 'image', label: 'ຮູບພາບ', field: 'image', sortable: true, align: 'left' as const },
  { name: 'type', label: 'ປະເພດເກມ', field: 'type', sortable: true, align: 'left' as const },
  { name: 'isEnable', label: 'ເປີດໃຊ້ງານ', field: 'isEnable', sortable: true, align: 'left' as const },
  { name: 'createdAt', label: 'ວັນທີສ້າງ', field: 'createdAt', sortable: true, align: 'left' as const },
  { name: 'updatedAt', label: 'ວັນທີແກ້ໄຂ', field: 'updatedAt', sortable: true, align: 'left' as const },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false, align: 'center' as const },
]);

const colseAddDialog = () => {
  dialog.value = false;
  game_model.value = {
    id: null,
    sourceId: '',
    providerId: null,
    name: '',
    image: null,
    type: '',
    serviceCode: null,
    isEnable: true,
  };
};

// Action handlers
const editGame = (gameData: Game) => {
  dialog.value = true;
  game_model.value = { ...gameData };
};

const deleteGame = async (game: Game) => {
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
      await onDeleteGame(game.id!);
    }
  });
  game_model.value = {
    id: null,
    sourceId: '',
    providerId: null,
    name: '',
    image: null,
    type: '',
    serviceCode: null,
    isEnable: true,
  };
};

const onDeleteGame = async (provider_id: number) => {
  await gameService.deleteGame(provider_id).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ລຶບຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getGames();
  });
};

const saveGame = async () => {
  try {
    const isValid = await formRef.value.validate();
    if (!isValid) {
      return;
    }

    dialog.value = false;
    processing.value = true;
    delete game_model.value.providers;
    delete game_model.value._count;
    if (game_model.value.id) {
      await updateGame();
    } else {
      await addGame();
    }

    game_model.value = {
      id: null,
      sourceId: '',
      providerId: null,
      name: '',
      image: null,
      type: '',
      serviceCode: null,
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

const addGame = async () => {
  await gameService.createGame(game_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ບັນທຶກຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '201' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    await getGames(pagination.value);
  });
};

const updateGame = async () => {
  await gameService.updateGame(game_model.value.id!, game_model.value).then(async (response) => {
    processing.value = false;
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: 'ແກ້ໄຂຂໍ້ມູນຜູ້ໃຫ້ບໍລິການສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
    void getGames(pagination.value);
  });
};

const enableGame = async (val: Game) => {
  await gameService.updateGame(val.id!, { isEnable: val.isEnable }).then(async (response) => {
    await Swal.fire({
      title: 'ສຳເລັດ',
      text: val.isEnable ? 'ເປີດໃຊ້ງານສຳເລັດແລ້ວ' : 'ປິດໃຊ້ງານສຳເລັດແລ້ວ',
      icon: response.code == '200' ? 'success' : 'error',
      timer: dialogDelay,
      confirmButtonColor: cfmBtnColor,
    });
  });
};

const paginationChange = async (val: any) => {
  pagination.value.page = val.page;
  pagination.value.rowsPerPage = val.rowsPerPage;
  await getGames(pagination.value);
};

const getGameTypes = async () => {
  const response = await gameService.getGameTypes();
  gameTypes.value = response.data;
};

const getGames = async (options?: TablePagination) => {
  loading.value = true;
  try {
    if (options && pagination.value.page == options.page && search.value == null) return;
    const response = await gameService.getGames({
      page: options?.page ?? null,
      limit: options?.rowsPerPage ?? null,
      search: search.value ?? null,
    });
    games.value = response.data;
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

const searchGame = async () => {
  await getGames(pagination.value);
};

// Pagination component event handlers
const onRowsPerPageChange = async (value: number) => {
  pagination.value.rowsPerPage = value;
  pagination.value.page = 1;
  await getGames(pagination.value);
};

const onFirstPage = async () => {
  pagination.value.page = 1;
  await getGames(pagination.value);
};

const onPrevPage = async () => {
  if (pagination.value.page > 1) {
    pagination.value.page--;
    await getGames(pagination.value);
  }
};

const onNextPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  if (pagination.value.page < totalPages) {
    pagination.value.page++;
    await getGames(pagination.value);
  }
};

const onLastPage = async () => {
  const totalPages = Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage);
  pagination.value.page = totalPages;
  await getGames(pagination.value);
};

const getProviders = async () => {
  const response = await providerService.getProviders();
  providers.value = response.data;
};

onMounted(async () => {
  try {
    void getGameTypes();
    void getProviders();
    await getGames(pagination.value);
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
