import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { PaymentMethodsResponse } from '../interfaces';

const getPaymentMethods = () => getRequest<PaymentMethodsResponse>('/paymentmethods');

export const useGetPaymentMethods = () =>
  useQuery(['paymentMethods'], () => getPaymentMethods(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.paymentMethods,
  });

export const useGetPaymentMethods2 = () =>
  useQuery(['paymentMethods'], () => getPaymentMethods(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.paymentMethods.filter((el) => el.code !== 'Cuenta Corriente'),
  });
