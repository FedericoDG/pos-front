import { useMutation, useQuery } from 'react-query';

import { getRequest, postRequest, putRequest } from '../services';
import { CashRegisterResponse, CashRegistersResponse } from '../interfaces';

interface Open {
  openingDate: Date;
  initialBalance: number;
}

interface Close {
  closingDate: Date;
}

const getCashRegisters = () => getRequest<CashRegistersResponse>('/cashregisters');
const getCashRegister = (id: number) => getRequest<CashRegisterResponse>(`/cashregisters/${id}`);
const getCashRegisterStatus = () => getRequest<CashRegisterResponse>(`/cashregisters/status`);
const openCashRegister = (open: Open) => postRequest('/cashregisters/', open);
const closeCashRegister = (close: Close) => putRequest('/cashregisters/', close);

export const useChasRegisters = () =>
  useQuery(['cashRegisters'], () => getCashRegisters(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.cashRegisters,
  });

export const useCashRegister = (id: number) =>
  useQuery(['cashRegisters', id], () => getCashRegister(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.cashRegister,
  });

export const useCashRegisterStatus = () =>
  useQuery(['cashRegisters'], () => getCashRegisterStatus(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.cashRegister,
  });

export const useOpenCashRegister = (onSuccess: () => void) => {
  return useMutation(openCashRegister, {
    onSuccess: onSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useCloseCashRegister = (onSuccess: () => void) => {
  return useMutation(closeCashRegister, {
    onSuccess: onSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
};
