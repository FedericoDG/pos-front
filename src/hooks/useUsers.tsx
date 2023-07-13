import { isError, useMutation, useQuery, useQueryClient } from 'react-query';

import { User, UserResponse, UsersResponse } from '../interfaces';
import { deleteRequest, getRequest, postRequest, putRequest } from '../services';

interface ResetPassword {
  id: number;
  password: string;
}

const getUsers = () => getRequest<UsersResponse>('/users');
const getUser = (id: number) => getRequest<UserResponse>(`/users/${id}`);
const createUser = (user: User) => postRequest('/users/', user);
const updateUser = (user: User) => putRequest(`/users/${user?.id}`, user);
const updateUserPassword = (pass: ResetPassword) =>
  putRequest(`/users/resetpassword/${pass.id}`, { password: pass.password });
const deleteUser = (id: number) => deleteRequest(`/users/${id}`);

export const useGetUsers = () =>
  useQuery(['users'], () => getUsers(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.users,
  });

export const useGetUser = (id: number) =>
  useQuery(['users', id], () => getUser(id), {
    enabled: !!id,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.user,
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useUpdateUserPassword = (onSuccess: () => void) => {
  return useMutation(updateUserPassword, {
    onSuccess,
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries('users');
    },
    onError: (error) => {
      if (isError(error)) {
        throw new Error(error.message);
      }
    },
  });
};
