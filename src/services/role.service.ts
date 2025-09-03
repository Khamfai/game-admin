import { api } from 'boot/axios';
import { Pagination } from 'src/interfaces/pagination';
import { ResponseData } from 'src/interfaces/response';
import { Role } from 'src/interfaces/role';

const path = '/v1/roles';

export const role_service = () => ({
  getRoles: async (pagination: Pagination = { page: 1, limit: 10 }): Promise<ResponseData<Role[]>> => {
    const response = await api.get(path, { params: pagination });
    return response.data;
  },

  getRoleById: async (id: string): Promise<ResponseData<Role | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createRole: async (roleName: string): Promise<ResponseData<Role | null>> => {
    const response = await api.post(path, { roleName }).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  updateRole: async (id: number, roleName: string): Promise<ResponseData<Role | null>> => {
    const response = await api.put(`${path}/${id}`, { roleName }).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  deleteRole: async (id: number): Promise<ResponseData<Role | null>> => {
    const response = await api.delete(`${path}/${id}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },
});
