import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { Unit, StocksResponse } from '../interfaces';

const getStocks = () => getRequest<StocksResponse>('/stocks');
const createUnit = (unit: Unit) => postRequest('/units/', unit);
const updateUnit = (unit: Unit) => putRequest(`/units/${unit?.id}`, unit);
const deleteUnit = (id: number) => deleteRequest(`/units/${id}`);

export const useGetStocks = () =>
  useQuery(['stocks', 'discharges'], () => getStocks(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.stocks,
  });

/* export const useCreateUnits = () => {
  const queryClient = useQueryClient();

  return useMutation(createUnit, {
    onSuccess: () => {
      queryClient.invalidateQueries('units');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateUnits = () => {
  const queryClient = useQueryClient();

  return useMutation(updateUnit, {
    onSuccess: () => {
      queryClient.invalidateQueries('units');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteUnits = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteUnit, {
    onSuccess: () => {
      queryClient.invalidateQueries('units');
    },
    onError: (error) => {
      console.log(error);
    },
  });
}; */
