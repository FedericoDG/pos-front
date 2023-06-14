import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { PriceListsResponse, PriceListReportResponse } from '../interfaces';

const getPriceLists = () => getRequest<PriceListsResponse>(`/pricelists`);
const getPriceListsReport = (
  products: string | null,
  pricelists: string | null,
  warehouses: string | null
) =>
  getRequest<PriceListReportResponse>(
    `/pricelists/report?products=${products}&pricelists=${pricelists}&warehouses=${warehouses}`
  );
/* const createCategory = (category: Category) => postRequest('/categories/', category);
const updateCategory = (category: Category) => putRequest(`/categories/${category?.id}`, category);
const deleteCategory = (id: number) => deleteRequest(`/categories/${id}`); */

export const useGetPriceLists = () =>
  useQuery(['priceLists'], () => getPriceLists(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.pricelists,
  });

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

/* export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
 */
