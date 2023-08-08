import { useMutation, useQuery } from 'react-query';

import { CashRegisterResponse, CashRegistersResponse } from '../interfaces';
import { getRequest, postRequest, putRequest } from '../services';
import { isError } from '../utils';

interface Open {
  openingDate: Date;
  initialBalance: number;
}

interface Close {
  closingDate: Date;
}

interface cartItem {
  productId: number;
  quantity: number;
  cost: number;
  reasonId: number;
  info: string;
}

interface Close2 extends Close {
  userId: number;
  warehouseId: number;
  cart: cartItem[];
  warehouseDestinationId: number;
}

const getCashRegisters = () => getRequest<CashRegistersResponse>('/cashregisters');
const getCashRegister = (id: number) => getRequest<CashRegisterResponse>(`/cashregisters/${id}`);
const getCashRegisterStatus = () => getRequest<CashRegisterResponse>(`/cashregisters/status`);
const getCashRegisterStatusByUserId = (id: number) =>
  getRequest<CashRegisterResponse>(`/cashregisters/statusByUserId/${id}`);
const openCashRegister = (open: Open) => postRequest('/cashregisters/', open);
const closeCashRegister = (close: Close) => putRequest('/cashregisters/', close);
const closeCashRegisterById = (close: Close2) =>
  putRequest(`/cashregisters/${close.userId}`, close);

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

export const useCashRegisterStatusByUserId = (id: number) =>
  useQuery(['cashRegisters', id], () => getCashRegisterStatusByUserId(id), {
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
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useCloseCashRegister = (onSuccess: () => void) => {
  return useMutation(closeCashRegister, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useCloseCashRegisterById = (onSuccess: () => void) => {
  return useMutation(closeCashRegisterById, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
