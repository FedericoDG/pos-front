import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { IvaTypesResponse } from '../interfaces';

const getIvaTypes = () => getRequest<IvaTypesResponse>(`/ivatypes`);

export const useGetIvaTypes = () =>
  useQuery(['ivaTypes'], () => getIvaTypes(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.ivaTypes,
  });
