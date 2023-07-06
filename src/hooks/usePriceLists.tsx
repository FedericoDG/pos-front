import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import {
  PriceListsResponse,
  PriceListReportResponse,
  Pricelists,
  PriceListByWareIdResponse,
} from '../interfaces';

const getPriceLists = () => getRequest<PriceListsResponse>(`/pricelists`);
const getPriceListByWareId = (priceListId: number, warehouseId: number) =>
  getRequest<PriceListByWareIdResponse>(`/pricelists/${priceListId}/${warehouseId}`);
const getPriceListsReport = (
  products: string | null,
  pricelists: string | null,
  warehouses: string | null
) =>
  getRequest<PriceListReportResponse>(
    `/pricelists/report?products=${products}&pricelists=${pricelists}&warehouses=${warehouses}`
  );
const createPriceList = (priceList: Pricelists) => postRequest('/pricelists/', priceList);
const updatePriceList = (priceList: Pricelists) =>
  putRequest(`/pricelists/${priceList?.id}`, priceList);
const deletePriceList = (id: number) => deleteRequest(`/pricelists/${id}`);

export const useGetPriceLists = () =>
  useQuery(['priceLists'], () => getPriceLists(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.pricelists,
  });

export const useGetPriceListByWarehouseId = (priceListId: number, warehouseId: number) =>
  useQuery(
    ['priceLists', priceListId, warehouseId],
    () => getPriceListByWareId(priceListId, warehouseId),
    {
      enabled: true,
      retry: 1,
      cacheTime: 1,
      refetchOnWindowFocus: false,
      select: (data) => data.body.pricelist.products,
    }
  );

export const useGetPriceListsReport = (
  products: string | null,
  pricelists: string | null,
  warehouses: string | null
) =>
  useQuery(
    ['priceLists', products, pricelists, warehouses],
    () => getPriceListsReport(products, pricelists, warehouses),
    {
      enabled: true,
      retry: 1,
      cacheTime: 1,
      refetchOnWindowFocus: false,
      select: (data) => data.body.pricelists,
    }
  );

export const useCreatePriceLists = () => {
  const queryClient = useQueryClient();

  return useMutation(createPriceList, {
    onSuccess: () => {
      queryClient.invalidateQueries('priceLists');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useUpdatePriceLists = () => {
  const queryClient = useQueryClient();

  return useMutation(updatePriceList, {
    onSuccess: () => {
      queryClient.invalidateQueries('priceLists');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useDeletePriceLists = () => {
  const queryClient = useQueryClient();

  return useMutation(deletePriceList, {
    onSuccess: () => {
      queryClient.invalidateQueries('priceLists');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
