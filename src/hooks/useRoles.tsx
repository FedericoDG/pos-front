import { useQuery } from 'react-query';

import { RolesResponse } from '../interfaces';
import { getRequest } from '../services';

const getUsers = () => getRequest<RolesResponse>('/roles');

export const useGetRoles = () =>
  useQuery(['roles'], () => getUsers(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.roles,
  });
