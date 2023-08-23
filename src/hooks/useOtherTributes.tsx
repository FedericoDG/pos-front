import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { OtherTributesResponse } from '../interfaces';

const getOtherTributes = () => getRequest<OtherTributesResponse>(`/othertributes`);

export const useGetOtherTributes = () =>
  useQuery(['otherTributes'], () => getOtherTributes(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.otherTributes,
  });
