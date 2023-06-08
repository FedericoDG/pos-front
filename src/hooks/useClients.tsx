import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services';
import { Client, ClientResponse, ClientsResponse } from '../interfaces';

const getClients = () => getRequest<ClientsResponse>('/clients');
const getClient = (id: number) => getRequest<ClientResponse>(`/clients/${id}`);
const createClient = (client: Client) => postRequest('/clients/', client);
const updateClient = (client: Client) => putRequest(`/clients/${client?.id}`, client);
const deleteClient = (id: number) => deleteRequest(`/clients/${id}`);

export const useGetClients = () =>
  useQuery(['clients'], () => getClients(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.clients,
  });

export const useGetClient = (id: number) =>
  useQuery(['clients', id], () => getClient(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.client,
  });

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation(createClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation(updateClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteClient, {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
