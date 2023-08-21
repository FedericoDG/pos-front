import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { IVAConditionResponse } from '../interfaces';

const getIVAConditions = () => getRequest<IVAConditionResponse>(`/ivaconditions`);

export const useGetIvaConditions = () =>
  useQuery(['ivaContitions'], () => getIVAConditions(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.ivaConditions,
  });
