import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { IdentificationsResponse } from '../interfaces';

const getIdentifications = () => getRequest<IdentificationsResponse>(`/identifications`);

export const useGetIdentifications = () =>
  useQuery(['identifications'], () => getIdentifications(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.identifications,
  });
