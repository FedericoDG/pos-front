import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import {
  ClientCurrentAccountResponse,
  CurrentAccount,
  CurrentAccountDetails,
  ResumeCurrentAccountResponse,
} from '../interfaces';
import { getRequest, postRequest } from '../services';

export interface Payment {
  id?: number;
  currentAccountId: number;
  paymentMethodId: number;
  amount: number;
  type: string;
  details: string;
}

interface Data {
  clientId: number;
  from: string;
  to: string;
}

export interface GetRecibo {
  body: {
    currentAccountDetails: CurrentAccountDetails & { currentAccount: CurrentAccount; };
  };
}

const getCurrentAccount = (data: Data) =>
  getRequest<ClientCurrentAccountResponse>(
    `/currentaccount?clientId=${data.clientId}&from=${data.from}&to=${data.to}`
  );

const getCurrentAccount2 = (id: number) =>
  getRequest<ClientCurrentAccountResponse>(`/currentaccount/${id}`);
const getCurrentAccountResume = () =>
  getRequest<ResumeCurrentAccountResponse>(`/currentaccount/resume/all`);
const createCurrentAccountPayment = (payment: Payment) => postRequest('/currentaccount/', payment);
const getRecibo = (id: number) => getRequest<GetRecibo>(`/currentaccount/recibo/${id}`);

export const useGetCurrentAccount = (data: Data) =>
  useQuery(['currentAccount'], () => getCurrentAccount(data), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });

export const useGetCurrentAccountResume = () =>
  useQuery(['currentAccount'], () => getCurrentAccountResume(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });

export const useGetCurrentAccount2 = (id: number) =>
  useQuery(['currentAccount', id], () => getCurrentAccount2(id), {
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

export const useGetRecibo = (id: number) =>
  useQuery(['currentAccount', id], () => getRecibo(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });
