import { useMutation, useQueryClient } from 'react-query';

import { deleteRequest, postRequest } from '../services';
import { Price } from '../interfaces';

const createPrice = (price: Price) => postRequest('/prices/', price);
const deletePrice = (id: number) => deleteRequest(`/prices/${id}`);

export const useCreatePrice = (onSuccess: () => void) => {
  return useMutation(createPrice, {
    onSuccess: onSuccess,
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeletePrice = () => {
  const queryClient = useQueryClient();

  return useMutation(deletePrice, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
