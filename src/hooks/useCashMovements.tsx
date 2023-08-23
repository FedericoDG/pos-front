import { isError, useMutation, useQuery } from 'react-query';

import { CashMovementResponse, CashMovementsResponse } from '../interfaces';
import { getRequest, postRequest } from '../services';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  allow: boolean;
}

interface CheckCart {
  cart: CartItem[];
  warehouseId: number;
}

interface Sale {
  clientId: number;
  warehouseId: number;
  discount?: number;
  recharge?: number;
  cart: CartItem[];
  payments: {
    amount: number;
    paymentMethodId: number;
  }[];
  info: string;
}

const getCashMovements = () => getRequest<CashMovementsResponse>('/cashmovements');
const getCashMovement = (id: number) => getRequest<CashMovementResponse>(`/cashmovements/${id}`);
const createCashMovement = (sale: Sale) => postRequest('/cashmovements/', sale);
const checkCart = (data: CheckCart) => postRequest('/cashmovements/check-cart/', data);

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

interface Body {
  response: {
    data: {
      body: {
        error: number[];
      };
    };
  };
}

export const useCreateCashMovement = (
  onSuccess: (res: any) => void,
  cb: (error: number[]) => void
) => {
  return useMutation(createCashMovement, {
    onSuccess: onSuccess,
    onError: (error: Body) => cb(error.response.data.body.error),
  });
};

export const useCheckCart = (cb: (error: number[]) => void) => {
  return useMutation(checkCart, {
    onSuccess: (res) => cb(res?.body?.error),
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
