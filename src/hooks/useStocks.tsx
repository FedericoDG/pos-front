import { isError, useMutation, useQuery } from 'react-query';

import { getRequest, postRequest } from '../services';
import { StocksResponse, StockResponse } from '../interfaces';

interface StockMovements {
  productId: number;
  warehouseId: number;
  from: string;
  to: string;
}

const getStocks = () => getRequest<StocksResponse>('/stocks');
const getStock = (id: number | null) => getRequest<StockResponse>(`/stocks/${id}`);
const getStockMovements = (stock: StockMovements) =>
  postRequest(`/stocks/${stock.warehouseId}`, {
    productId: stock.productId,
    from: stock.from,
    to: stock.to,
  });

export const useGetStocks = () =>
  useQuery(['stocks', 'costs', 'discharges', 'transfers'], () => getStocks(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.stocks,
  });

export const useGetStock = (id: number | null) =>
  useQuery(['stocks', id], () => getStock(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.stocks,
  });

export const useGetStockMovements = (onSuccess: () => any) => {
  return useMutation(getStockMovements, {
    onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
