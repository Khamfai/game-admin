<template>
  <div class="row items-center justify-end q-gutter-x-sm">
    <div>{{ rowsPerPageLabel }}:</div>
    <q-select
      :model-value="pagination.rowsPerPage"
      @update:model-value="onRowsPerPageChange"
      emit-value
      map-options
      borderless
      rounded
      dense
      :options="rowsPerPageOptions"
    />
    <div class="row items-center justify-end">
      <q-btn round size="sm" flat icon="first_page" :disable="pagination.page <= 1" @click="onFirstPage" />
      <q-btn round size="sm" flat icon="chevron_left" :disable="pagination.page <= 1" @click="onPrevPage" />
    </div>
    <div>{{ startItem }}-{{ endItem }} of {{ pagination.rowsNumber }}</div>
    <div class="row items-center justify-end">
      <q-btn round size="sm" flat icon="chevron_right" :disable="pagination.page >= totalPages" @click="onNextPage" />
      <q-btn round size="sm" flat icon="last_page" :disable="pagination.page >= totalPages" @click="onLastPage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TablePagination } from 'src/interfaces/pagination';

interface Props {
  pagination: TablePagination;
  rowsPerPageOptions?: number[];
  rowsPerPageLabel?: string;
}

interface Emits {
  (e: 'rows-per-page-change', value: number): void;
  (e: 'first-page'): void;
  (e: 'prev-page'): void;
  (e: 'next-page'): void;
  (e: 'last-page'): void;
}

const props = withDefaults(defineProps<Props>(), {
  rowsPerPageOptions: () => [5, 10, 20, 50],
  rowsPerPageLabel: 'ຈຳນວນຕໍ່ຫນ້າ',
});

const emit = defineEmits<Emits>();

// Computed properties
const totalPages = computed(() => {
  return Math.ceil(props.pagination.rowsNumber / props.pagination.rowsPerPage);
});

const startItem = computed(() => {
  return (props.pagination.page - 1) * props.pagination.rowsPerPage + 1;
});

const endItem = computed(() => {
  const end = props.pagination.page * props.pagination.rowsPerPage;
  return Math.min(end, props.pagination.rowsNumber);
});

// Event handlers
const onRowsPerPageChange = (value: number) => {
  emit('rows-per-page-change', value);
};

const onFirstPage = () => {
  emit('first-page');
};

const onPrevPage = () => {
  emit('prev-page');
};

const onNextPage = () => {
  emit('next-page');
};

const onLastPage = () => {
  emit('last-page');
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
