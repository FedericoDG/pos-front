import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { ClientCurrentAccountResponse } from '../interfaces';
import { getRequest, postRequest } from '../services';

export interface Payment {
  id?: number;
  currentAccountId: number;
  paymentMethodId: number;
  amount: number;
  type: string;
  details: string;
}

const getCurrentAccount = (id: number) =>
  getRequest<ClientCurrentAccountResponse>(`/currentaccount/${id}`);
const createCurrentAccountPayment = (payment: Payment) => postRequest('/currentaccount/', payment);

export const useGetCurrentAccount = (id: number) =>
  useQuery(['currentAccount', id], () => getCurrentAccount(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });

export const useCreateCurrentAccountPayment = () => {
  const queryClient = useQueryClient();

  return useMutation(createCurrentAccountPayment, {
    onSuccess: () => {
      queryClient.invalidateQueries('currentAccount');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
