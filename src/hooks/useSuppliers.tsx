import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { Supplier, SupplierResponse, SuppliersResponse } from '../interfaces';

const getSuppliers = () => getRequest<SuppliersResponse>('/suppliers');
const getSupplier = (id: number) => getRequest<SupplierResponse>(`/suppliers/${id}`);
const createSupplier = (supplier: Supplier) => postRequest('/suppliers/', supplier);
const updateSupplier = (supplier: Supplier) => putRequest(`/suppliers/${supplier?.id}`, supplier);
const deleteSupplier = (id: number) => deleteRequest(`/suppliers/${id}`);

export const useGetSuppliers = () =>
  useQuery(['suppliers'], () => getSuppliers(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.suppliers,
  });

export const useGetSupplier = (id: number) =>
  useQuery(['suppliers', id], () => getSupplier(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.supplier,
  });

export const useCreateSupplier = (onSuccess: (res: any) => void, onError: (error: any) => void) => {
  return useMutation(createSupplier, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useUpdateSupplier = (onSuccess: (res: any) => void, onError: (error: any) => void) => {
  return useMutation(updateSupplier, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSupplier, {
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
