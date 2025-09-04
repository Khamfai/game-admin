import { api } from "src/boot/axios";
import { Package } from "src/interfaces/package";
import { ResponseData } from "src/interfaces/response";
import { Pagination } from "src/interfaces/pagination";

const path = '/v1/packages'

export const package_service = () => ({
  getPackages: async (pagination?: Pagination): Promise<ResponseData<Package[]>> => {
    const response = await api.get(path, { params: pagination });
    return response.data;
  },

  getPackageById: async (id: number): Promise<ResponseData<Package | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createPackage: async (packageService: Package): Promise<ResponseData<Package | null>> => {
    delete packageService.id;
    const response = await api.post(path, packageService);
    return response.data;
  },

  updatePackage: async (id: number, packageService: Partial<Package>): Promise<ResponseData<Package | null>> => {
    delete packageService.id;
    const response = await api.put(`${path}/${id}`, packageService);
    return response.data;
  },

  deletePackage: async (id: number): Promise<ResponseData<Package | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
