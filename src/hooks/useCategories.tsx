import { useMutation, useQuery, useQueryClient } from 'react-query';

import { deleteRequest, getRequest, postRequest, putRequest } from '../services/';
import { CategoriesResponse, Category } from '../interfaces';

const getCategories = () => getRequest<CategoriesResponse>(`/categories`);
const createCategory = (category: Category) => postRequest('/categories/', category);
const updateCategory = (category: Category) => putRequest(`/categories/${category?.id}`, category);
const deleteCategory = (id: number) => deleteRequest(`/categories/${id}`);

export const useGetCategories = () =>
  useQuery(['categories'], () => getCategories(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.categories,
  });

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(createCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
