import { useMutation, useQuery } from 'react-query';

import { getRequest, postRequest } from '../services';
import { TransferResponse, TransfersResponse } from '../interfaces';

interface CreateTransfer {
  warehouseOriginId: number;
  warehouseDestinationId: number;
  cart: {
    productId: number;
    quantity: number;
  }[];
}

const getTransfers = () => getRequest<TransfersResponse>('/transfers');
const getTransfer = (id: number) => getRequest<TransferResponse>(`/transfers/${id}`);
const createTransfer = (transfer: CreateTransfer) => postRequest('/transfers/', transfer);

export const useGetTransfers = () =>
  useQuery(['transfers'], () => getTransfers(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.transfers,
  });

export const useGetTransfer = (id: number) =>
  useQuery(['transfers', id], () => getTransfer(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.transfer,
  });

export const useCreateTransfer = (onSuccess: () => any) => {
  return useMutation(createTransfer, {
    onSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
};
