import { useQuery } from 'react-query';

import { getRequest } from '../services';
import { InvoceTypesResponse } from '../interfaces';

const getInvoceTypes = () => getRequest<InvoceTypesResponse>(`/invocetypes`);

export const useGetInvoceTypes = () =>
  useQuery(['invoceTypes'], () => getInvoceTypes(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.invoceTypes,
  });
