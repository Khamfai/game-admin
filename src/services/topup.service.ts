import { api } from 'boot/axios';
import { ResponseData } from 'src/interfaces/response';
import { Pagination } from 'src/interfaces/pagination';
import { Topup } from 'src/interfaces/topup';

const path = '/v1/topups';

export const topup_service = () => ({
  getTopups: async (pagination?: Pagination): Promise<ResponseData<Topup[]>> => {
    const response = await api.get(path, { params: pagination });
    return response.data;
  },

  getTopupsByUserId: async (userId: number, pagination?: Pagination): Promise<ResponseData<Topup[]>> => {
    const response = await api.get(`${path}/user/${userId}`, { params: pagination });
    return response.data;
  },

  getTopupById: async (id: number): Promise<ResponseData<Topup | null>> => {
    const response = await api.get(`${path}/${id}`);
    return response.data;
  },

  createTopup: async (topup: Topup): Promise<ResponseData<Topup | null>> => {
    const response = await api.post(path, topup);
    return response.data;
  },

  updateTopup: async (id: number, topup: Partial<Topup>): Promise<ResponseData<Topup | null>> => {
    delete topup.id;
    const response = await api.put(`${path}/${id}`, topup);
    return response.data;
  },

  deleteTopup: async (id: number): Promise<ResponseData<Topup | null>> => {
    const response = await api.delete(`${path}/${id}`);
    return response.data;
  },
});
