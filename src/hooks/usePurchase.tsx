import { useMutation, useQuery } from 'react-query';

import { getRequest, postRequest } from '../services';
import { PurchaseResponse, PurchasesResponse } from '../interfaces';

interface CreatePurchase {
  supplierId: number;
  warehouseId: number;
  total: number;
  date: Date;
  cart: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}

const getPurchases = () => getRequest<PurchasesResponse>('/purchases');
const getPurchase = (id: number) => getRequest<PurchaseResponse>(`/purchases/${id}`);
const createPurchase = (purchase: CreatePurchase) => postRequest('/purchases/', purchase);

export const useGetPurchases = () =>
  useQuery(['purchases'], () => getPurchases(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.purchases,
  });

export const useGetPurchase = (id: number) =>
  useQuery(['purchases', id], () => getPurchase(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.purchase,
  });

export const useCreatePurchase = (onSuccess: () => any, onError: () => any) => {
  return useMutation(createPurchase, {
    onSuccess,
    onError,
    /*  onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    }, */
  });
};
