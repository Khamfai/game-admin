import { api } from 'boot/axios';
import { Permission } from 'src/interfaces/permission';
import { ResponseData } from 'src/interfaces/response';

const path = '/v1/permissions';

export const permission_service = () => ({
  getPermissions: async (): Promise<ResponseData<Permission[]>> => {
    const response = await api.get(path);
    return response.data;
  },

  getPermissionById: async (id: number): Promise<ResponseData<Permission | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createPermission: async (permissionName: string): Promise<ResponseData<Permission | null>> => {
    const response = await api.post(path, { name: permissionName });
    return response.data;
  },

  updatePermission: async (id: number, permissionName: string): Promise<ResponseData<Permission | null>> => {
    const response = await api.put(`${path}/${id}`, { name: permissionName });
    return response.data;
  },

  deletePermission: async (id: number): Promise<ResponseData<Permission | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
