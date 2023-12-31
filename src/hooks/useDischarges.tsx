import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { Discharge, DischargeResponse, DischargesResponse } from '../interfaces';
import { getRequest, postRequest, putRequest } from '../services';

type DischargeCart = {
  productId: number;
  reasonId: number;
  quantity: number;
};

type CreateDischargeBody = {
  warehouseId: number;
  cart: DischargeCart[];
};

const getDischarges = () => getRequest<DischargesResponse>('/discharges');
const getDischarge = (id: number) => getRequest<DischargeResponse>(`/discharges/${id}`);
const createDischarge = (discharge: CreateDischargeBody) => postRequest('/discharges/', discharge);
const updateDischarge = (discharge: Discharge) =>
  putRequest(`/discharges/${discharge?.id}`, discharge);

export const useGetDischarges = () =>
  useQuery(['discharges'], () => getDischarges(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.discharges,
  });

export const useGetDischarge = (id: number) =>
  useQuery(['discharges', id], () => getDischarge(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.discharge,
  });

export const useCreateDischarge = (onSuccess: () => void, onError: (error: any) => void) => {
  return useMutation(createDischarge, {
    onSuccess: onSuccess,
    onError: onError,
  });
};

export const useUpdateDischarge = () => {
  const queryClient = useQueryClient();

  return useMutation(updateDischarge, {
    onSuccess: () => {
      queryClient.invalidateQueries('discharges');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
