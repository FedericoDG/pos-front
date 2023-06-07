import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { useToast } from '@chakra-ui/react';

import { getRequest, postRequest, putRequest } from '../services/httpRequest';
import { Product } from '../interfaces';

const getProducts = () => getRequest('/products');
const createProduct = (product: Product) => postRequest('/products/', product);
const updateProduct = (product: Product) => putRequest(`/products/${product?.id}`, product);

export const useGetProducts = () => {
  //const toast = useToast();

  return useQuery(['products'], () => getProducts(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    /*  onSuccess: () =>
      toast({
        title: 'Unidades recuperadas',
        status: 'info',
        duration: 2000,
        isClosable: true,
      }),
    onError: () => { }, */
    select: (data) => data.body.products,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(createProduct, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(updateProduct, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
