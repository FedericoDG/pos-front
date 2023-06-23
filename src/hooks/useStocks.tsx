import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { StocksResponse, StockResponse } from '../interfaces';

const getStocks = () => getRequest<StocksResponse>('/stocks');
const getStock = (id: number | null) => getRequest<StockResponse>(`/stocks/${id}`);

export const useGetStocks = () =>
  useQuery(['stocks', 'discharges', 'transfers'], () => getStocks(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.stocks,
  });

export const useGetStock = (id: number | null) =>
  useQuery(['reasons', id], () => getStock(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.stocks,
  });
