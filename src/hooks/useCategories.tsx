import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { useToast } from '@chakra-ui/react';

import { getRequest, postRequest } from '../services/httpRequest';

const getCategories = () => getRequest(`/categories`);

// const createBalance = (balance) => postRequest('/balance/', balance);

// GET units
export const useGetCategories = () => {
  //const toast = useToast();

  return useQuery(['categories'], () => getCategories(), {
    enabled: true,
    retry: 1,
    cacheTime: 1,
    refetchOnWindowFocus: false,
    /*  onSuccess: () =>
      toast({
        title: 'Unidades recuperadas',
        status: 'info',
        duration: 2000,
        isClosable: true,
      }),
    onError: () => { }, */
    select: (data) => data.body.categories,
  });
};

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
