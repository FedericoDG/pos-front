import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { Reason, ReasonResponse, ReasonsResponse } from '../interfaces';

const getReasons = () => getRequest<ReasonsResponse>('/reasons');
const getReason = (id: number) => getRequest<ReasonResponse>(`/reasons/${id}`);
const createReason = (reason: Reason) => postRequest('/reasons/', reason);
const updateReason = (reason: Reason) => putRequest(`/reasons/${reason?.id}`, reason);
const deleteReason = (id: number) => deleteRequest(`/reasons/${id}`);

export const useGetReasons = () =>
  useQuery(['reasons'], () => getReasons(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.reasons,
  });

export const useGetReason = (id: number) =>
  useQuery(['reasons', id], () => getReason(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.reason,
  });

export const useCreateReason = () => {
  const queryClient = useQueryClient();

  return useMutation(createReason, {
    onSuccess: () => {
      queryClient.invalidateQueries('reasons');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateReason = () => {
  const queryClient = useQueryClient();

  return useMutation(updateReason, {
    onSuccess: () => {
      queryClient.invalidateQueries('reasons');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteReason = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteReason, {
    onSuccess: () => {
      queryClient.invalidateQueries('reasons');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
