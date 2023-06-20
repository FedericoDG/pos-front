import { useMutation, useQueryClient } from 'react-query';

import { postRequest } from '../services';

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

const createPurchase = (purchase: CreatePurchase) => postRequest('/purchases/', purchase);
// const deletePrice = (id: number) => deleteRequest(`/prices/${id}`);

export const useCreatePurchase = (onSuccess: () => any) => {
  const queryClient = useQueryClient();

  return useMutation(createPurchase, {
    onSuccess,
    /*   onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }, */
    onError: (error) => {
      console.log(error);
    },
  });
};

/* export const useDeletePrice = () => {
  const queryClient = useQueryClient();

  return useMutation(deletePrice, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
}; */
