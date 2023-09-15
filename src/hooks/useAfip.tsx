import { isError, useMutation, useQuery } from 'react-query';

import { getRequest, putRequest } from '../services';
import { AfipResponse } from '../interfaces/responses';
import { Afip } from '../interfaces';

const getAfip = () => getRequest<AfipResponse>(`/afip/1`);
const updateAfip = (settings: Afip) => putRequest(`/afip/1`, settings);

export const useGetAfip = () =>
  useQuery(['settings'], () => getAfip(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.afip,
  });

export const useUpdateAfip = (onSuccess: () => void) => {
  return useMutation(updateAfip, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
