import { api } from 'src/boot/axios';
import { Package, SpacialPackage } from 'src/interfaces/package';
import { ResponseData } from 'src/interfaces/response';
import { Pagination } from 'src/interfaces/pagination';

const path = '/v1/packages';
const translatePath = '/v1/imports/translate/package';

export const package_service = () => ({
  getPackages: async (pagination?: Pagination): Promise<ResponseData<Package[]>> => {
    const response = await api.get(path, { params: pagination }).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  getPackageById: async (id: number): Promise<ResponseData<Package | null>> => {
    const response = await api.get(`${path}/${id}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  createPackage: async (packageService: Package): Promise<ResponseData<Package | null>> => {
    delete packageService.id;
    const response = await api.post(path, packageService).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  updatePackage: async (id: number, packageService: Partial<Package>): Promise<ResponseData<Package | null>> => {
    delete packageService.id;
    const response = await api.put(`${path}/${id}`, packageService).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  deletePackage: async (id: number): Promise<ResponseData<Package | null>> => {
    const response = await api.delete(`${path}/${id}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  getSpacialPackages: async (packageId: number, pagination?: Pagination): Promise<ResponseData<SpacialPackage[]>> => {
    const response = await api.get(`${path}/spacial/price/${packageId}`, { params: pagination }).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  createSpacialPackage: async (spacialPackage: SpacialPackage): Promise<ResponseData<SpacialPackage | null>> => {
    const response = await api.post(`${path}/spacial/price`, spacialPackage).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  updateSpacialPackage: async (
    id: number,
    spacialPackage: Partial<SpacialPackage>,
  ): Promise<ResponseData<SpacialPackage | null>> => {
    const response = await api.put(`${path}/spacial/price/${id}`, spacialPackage).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  deleteSpacialPackage: async (id: number): Promise<ResponseData<SpacialPackage | null>> => {
    const respone = await api.delete(`${path}/spacial/price/${id}`).catch((error) => {
      return error.response;
    });
    return respone.data;
  },

  translatePackage: async (id: number): Promise<ResponseData<Package | null>> => {
    const response = await api.get(`${translatePath}/${id}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },
});
