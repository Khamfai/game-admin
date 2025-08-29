import { api } from 'boot/axios';
import { ResponseData } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';

const path = '/v1/roles';

export const role_service = () => ({
  getRoles: async (): Promise<ResponseData<Role[]>> => {
    const response = await api.get(path);
    return response.data;
  },

  getRoleById: async (id: string): Promise<ResponseData<Role | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createRole: async (roleName: string): Promise<ResponseData<Role | null>> => {
    const response = await api.post(path, { roleName });
    return response.data;
  },

  updateRole: async (id: string, roleName: string): Promise<ResponseData<Role | null>> => {
    const response = await api.put(`${path}/${id}`, { roleName });
    return response.data;
  },

  deleteRole: async (id: string): Promise<ResponseData<Role | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
