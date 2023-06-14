import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { Supplier, SupplierResponse, SuppliersResponse } from '../interfaces';

const getSuppliers = () => getRequest<SuppliersResponse>('/Suppliers');
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

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(createSupplier, {
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(updateSupplier, {
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSupplier, {
    onSuccess: () => {
      queryClient.invalidateQueries('suppliers');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
