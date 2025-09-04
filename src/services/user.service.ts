import { api } from 'boot/axios';
import { Pagination } from 'src/interfaces/pagination';
import { ResponseData } from 'src/interfaces/response';
import { User } from 'src/interfaces/user';

const path = '/v1/users';

export const user_service = () => ({
  getUsers: async (pagination: Pagination = { page: 1, limit: 50 }): Promise<ResponseData<User[]>> => {
    const response = await api.get(path, { params: pagination });
    return response.data;
  },

  getUserById: async (id: string): Promise<ResponseData<User | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createUser: async (user: User): Promise<ResponseData<User | null>> => {
    const response = await api.post(path, user).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  updateUser: async (id: number, user: Partial<User>): Promise<ResponseData<User | null>> => {
    const response = await api.put(`${path}/${id}`, user).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  deleteUser: async (id: number): Promise<ResponseData<User | null>> => {
    const response = await api.delete(`${path}/${id}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  addUserPermissions: async (uid: number, permissionId: number): Promise<ResponseData<User | null>> => {
    const response = await api.post(`${path}/permissions`, { userId: uid, permissionId }).catch((error) => {
      return error.response;
    });
    return response.data;
  },

  removeUserPermissions: async (uid: number, permissionId: number): Promise<ResponseData<User | null>> => {
    const response = await api.delete(`${path}/permissions/${uid}/${permissionId}`).catch((error) => {
      return error.response;
    });
    return response.data;
  },
});
