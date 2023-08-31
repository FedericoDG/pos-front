import { isError, useMutation, useQuery } from 'react-query';

import { getRequest, putRequest } from '../services';
import { SettingsResponse } from '../interfaces/responses';
import { Settings } from '../interfaces';

const getSettings = (id: number) => getRequest<SettingsResponse>(`/settings/${id}`);
const updateSettings = (settings: Settings) => putRequest(`/settings/1`, settings);

export const useGetSettings = (id: number) =>
  useQuery(['settings', id], () => getSettings(id), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.settings,
  });

export const useUpdateSettings = (onSuccess: () => void) => {
  return useMutation(updateSettings, {
    onSuccess: onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
