import { isError, useMutation, useQuery } from 'react-query';

import { CashMovementResponse, CashMovementsResponse } from '../interfaces';
import { getRequest, postRequest } from '../services';

interface Sale {
  clientId: number;
  warehouseId: number;
  paymentMethodId: number;
  discount?: number;
  recharge?: number;
  cart: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

const getCashMovements = () => getRequest<CashMovementsResponse>('/cashmovements');
const getCashMovement = (id: number) => getRequest<CashMovementResponse>(`/cashmovements/${id}`);
const createCashMovement = (sale: Sale) => postRequest('/cashmovements/', sale);

export const useGetCashMovements = () =>
  useQuery(['clients'], () => getCashMovements(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.cashMovements,
  });

export const useGetCashMovement = (id: number) =>
  useQuery(['clients', id], () => getCashMovement(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.cashMovement,
  });

export const useCreateCashMovement = (onSuccess: () => void) => {
  return useMutation(createCashMovement, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
