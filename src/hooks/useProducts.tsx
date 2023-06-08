import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services/';
import { Product, ProductResponse, ProductsResponse } from '../interfaces';

const getProducts = () => getRequest<ProductsResponse>('/products');
const getProduct = (id: number) => getRequest<ProductResponse>(`/products/${id}`);
const createProduct = (product: Product) => postRequest('/products/', product);
const updateProduct = (product: Product) => putRequest(`/products/${product?.id}`, product);
const deleteProduct = (id: number) => deleteRequest(`/products/${id}`);

export const useGetProducts = () =>
  useQuery(['products'], () => getProducts(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.products,
  });

export const useGetProduct = (id: number) =>
  useQuery(['products', id], () => getProduct(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.product,
  });

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(createProduct, {
    onSuccess: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
