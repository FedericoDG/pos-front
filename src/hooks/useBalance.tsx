import { useQuery } from 'react-query';

import { BalanceResponse, LibroIva } from '../interfaces';
import { getRequest } from '../services';

interface Data {
  userId: number;
  clientId: number;
  invoices: string;
  from: string;
  to: string;
}
interface Data2 {
  from: string;
  to: string;
}

const getBalance = (data: Data) =>
  getRequest<BalanceResponse>(
    `/movements?userId=${data.userId}&clientId=${data.clientId}&invoices=${data.invoices}&from=${data.from}&to=${data.to}`,
    data
  );

const getLibroIva = (data: Data2) =>
  getRequest<LibroIva>(`/cashmovements/iva?from=${data.from}&to=${data.to}`, data);

export const useGetBalance = (data: Data) =>
  useQuery(['balance'], () => getBalance(data), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });

export const useGetLibroIva = (data: Data2) =>
  useQuery(['balance'], () => getLibroIva(data), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body,
  });
