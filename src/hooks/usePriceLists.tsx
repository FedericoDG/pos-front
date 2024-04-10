import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import {
  PriceListsResponse,
  PriceListReportResponse,
  Pricelists,
  PriceListByWareIdResponse,
  PriceListByIdResponse,
} from '../interfaces';

interface Query {
  id: number;
  warehouseId: number;
  query: string;
}

const getPriceLists = () => getRequest<PriceListsResponse>(`/pricelists`);
const getPriceListById = (priceListId: number) =>
  getRequest<PriceListByIdResponse>(`/pricelists/${priceListId}`);
const getPriceListByWareId = (priceListId: number, warehouseId: number) =>
  getRequest<PriceListByWareIdResponse>(`/pricelists/${priceListId}/${warehouseId}`);
const getPriceListByWareIdQuery = (priceListId: number, warehouseId: number, query: string) =>
  getRequest<PriceListByWareIdResponse>(`/pricelists/query/${priceListId}/${warehouseId}/${query}`);
const getPriceListsReport = (
  products: string | null,
  pricelists: string | null,
  warehouses: string | null
) =>
  getRequest<PriceListReportResponse>(
    `/pricelists/report?products=${products}&pricelists=${pricelists}&warehouses=${warehouses}`
  );
const createPriceList = (priceList: Pricelists) => postRequest('/pricelists/', priceList);
const queryPriceList = (priceList: Query) => postRequest('/pricelists/', priceList);
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

export const useGetPriceListById = (priceListId: number) =>
  useQuery(['priceLists', priceListId], () => getPriceListById(priceListId), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.products,
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

export const useQueryPriceLists = () => {
  const queryClient = useQueryClient();

  return useMutation(queryPriceList, {
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
