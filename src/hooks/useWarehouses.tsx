import { isError, useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'sonner';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services/';
import { Warehouse, WarehouseResponse, WarehousesResponse } from '../interfaces';

interface Driver {
  id?: number;
  code: string;
  driver: number;
  description: string;
  name: string | undefined;
  lastname: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

const getWarehouses = () => getRequest<WarehousesResponse>('/warehouses');
const getWarehousesWOStock = () => getRequest<WarehousesResponse>('/warehouses?nostock=true');
const getWarehouse = (id: number | null) => getRequest<WarehouseResponse>(`/warehouses/${id}`);
const getWarehouseByUserId = (id: number | null) =>
  getRequest<WarehouseResponse>(`/warehouses/user/${id}`);
const createWarehouse = (warehouse: Warehouse | Driver) => postRequest('/warehouses/', warehouse);
const updateWarehouse = (warehouse: Warehouse | Driver) =>
  putRequest(`/warehouses/${warehouse?.id}`, warehouse);
const deleteWarehouse = (id: number) => deleteRequest(`/warehouses/${id}`);

export const useGetWarehouses = () =>
  useQuery(['warehouses'], () => getWarehouses(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.warehouses,
  });

export const useGetWarehousesWOStock = () =>
  useQuery(['warehouses'], () => getWarehousesWOStock(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.warehouses,
  });

export const useGetWarehouse = (id: number | null) =>
  useQuery(['warehouses', id], () => getWarehouse(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.warehouse,
  });

export const useGetWarehouseByUserId = (id: number | null) =>
  useQuery(['warehouses', id], () => getWarehouseByUserId(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.warehouse,
  });

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation(createWarehouse, {
    onSuccess: () => {
      queryClient.invalidateQueries('warehouses');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useUpdateWarehose = () => {
  const queryClient = useQueryClient();

  return useMutation(updateWarehouse, {
    onSuccess: () => {
      queryClient.invalidateQueries('warehouses');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useDeleteWarehose = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteWarehouse, {
    onSuccess: () => {
      queryClient.invalidateQueries('warehouses');
    },
    onError: (_error) => {
      toast.error('Error al intentar eliminar el Depósito');
    },
  });
};
