import { isError, useMutation, useQuery } from 'react-query';

import { getRequest, postRequest, putRequest } from '../services';
import { AfipResponse } from '../interfaces/responses';
import { Afip } from '../interfaces';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  allow?: boolean;
}
export interface Sale {
  cashMovementId: number;
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

export interface CreditNote extends Sale {
  invoceTypeId: number;
  invoceNumber: number;
}

const getAfip = () => getRequest<AfipResponse>(`/afip/1`);
const createInvoce = (sale: Sale) => postRequest(`/afip/`, sale);
const createNoteCredit = (sale: CreditNote) => postRequest(`/afip/nota-credito`, sale);
const updateAfip = (settings: Afip) => putRequest(`/afip/1`, settings);

export const useGetAfip = () =>
  useQuery(['settings'], () => getAfip(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.afip,
  });

export const useCreateAfipInvoce = (onSuccess: (res: any) => void, onError: (res: any) => void) => {
  return useMutation(createInvoce, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useCreateAfipCreditNote = (
  onSuccess: (res: any) => void,
  onError: (res: any) => void
) => {
  return useMutation(createNoteCredit, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useUpdateAfip = (onSuccess: () => void) => {
  return useMutation(updateAfip, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
