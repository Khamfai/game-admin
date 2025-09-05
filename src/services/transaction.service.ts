import { ResponseData } from 'src/interfaces/response';
import { api } from 'src/boot/axios';
import { Transaction } from 'src/interfaces/transaction';
import { Pagination } from 'src/interfaces/pagination';

export const transaction_service = () => {
  const path = '/v1/transactions';

  return {
    getTransactions: async (pagination?: Pagination): Promise<ResponseData<Transaction[]>> => {
      const response = await api.get(`${path}`, { params: pagination });
      return response.data;
    },
    getTransactionById: async (id: number): Promise<ResponseData<Transaction>> => {
      const response = await api.get(`${path}/${id}`);
      return response.data;
    },
    getTransactionsByUserId: async (userId: number, pagination?: Pagination): Promise<ResponseData<Transaction[]>> => {
      const response = await api.get(`${path}/user/${userId}`, { params: pagination });
      return response.data;
    },
    createTransaction: async (transaction: Transaction): Promise<ResponseData<Transaction>> => {
      const response = await api.post(`${path}`, transaction);
      return response.data;
    },
    updateTransaction: async (id: number, transaction: Partial<Transaction>): Promise<ResponseData<Transaction>> => {
      const response = await api.put(`${path}/${id}`, transaction);
      return response.data;
    },

    deleteTransaction: async (id: number): Promise<ResponseData<Transaction>> => {
      const response = await api.delete(`${path}/${id}`);
      return response.data;
    },
  };
};
