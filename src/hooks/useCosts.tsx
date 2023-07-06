import { isError, useMutation } from 'react-query';

import { postRequest } from '../services';

interface CreateCost {
  cart: {
    price: number;
  }[];
}

const createCost = (cost: CreateCost) => postRequest('/costs/', cost);

export const useCreateCost = (onSuccess: () => any) => {
  return useMutation(createCost, {
    onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
