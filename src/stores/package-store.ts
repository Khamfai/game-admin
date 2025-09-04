import { defineStore } from 'pinia';
import { Package } from 'src/interfaces/package';
import { ref } from 'vue';

export const usePackageStore = defineStore('package', () => {
  const packageData = ref<Package | null>(null);

  const setPackage = (data: Package) => {
    packageData.value = data;
  };

  const getPackage = () => {
    return packageData.value;
  };

  return {
    packageData,
    setPackage,
    getPackage,
  };
});
