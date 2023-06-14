import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services/';
import { Warehouse, WarehouseResponse, WarehousesResponse } from '../interfaces';

const getWarehouses = () => getRequest<WarehousesResponse>('/warehouses');
const getWarehouse = (id: number) => getRequest<WarehouseResponse>(`/warehouses/${id}`);
const createWarehouse = (warehouse: Warehouse) => postRequest('/warehouses/', warehouse);
const updateWarehouse = (warehouse: Warehouse) =>
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

export const useGetWarehouse = (id: number) =>
  useQuery(['warehouses', id], () => getWarehouse(id), {
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
      console.log(error);
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
      console.log(error);
    },
  });
};

export const useDeleteWarehose = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteWarehouse, {
    onSuccess: () => {
      queryClient.invalidateQueries('warehouses');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
