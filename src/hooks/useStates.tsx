import { useQuery } from 'react-query';

import { StatesResponse } from '../interfaces';
import { getRequest } from '../services';

const getStates = () => getRequest<StatesResponse>('/states');

export const useGetStates = () =>
  useQuery(['states'], () => getStates(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.states,
  });
