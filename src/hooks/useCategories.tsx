import { useMutation, useQuery, useQueryClient } from 'react-query';

import { getRequest } from '../services/';
import { CategoriesResponse } from '../interfaces';

const getCategories = () => getRequest<CategoriesResponse>(`/categories`);

// GET units
export const useGetCategories = () =>
  useQuery(['categories'], () => getCategories(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    select: (data) => data.body.categories,
  });

// MUTATION POST
/* export const usePostBalance = () => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  return useMutation(createBalance, {
    onSuccess: (res) => {
      queryClient.invalidateQueries('balance');
      enqueueSnackbar(res.msg, {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.msg, {
        variant: 'error',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
    },
  });
}; */
