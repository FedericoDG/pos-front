import { Box, Button, Stack } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

import { useGetBalance } from '../../hooks';
import { Loading } from '../common';

import { useBalanceContext } from '.';

export const Sheet = () => {
  const { user, payment, from, to, goToPrevious } = useBalanceContext();

  const data = {
    userId: user?.value!,
    paymentMethodId: payment?.value!,
    from,
    to,
  };

  const { data: balance, isFetching } = useGetBalance(data);

  if (isFetching) return <Loading />;

  return (
    <Stack>
      <Button
        colorScheme="brand"
        leftIcon={<ArrowBackIcon />}
        minW="170px"
        mr="auto"
        size="lg"
        onClick={() => goToPrevious()}
      >
        VOLVER
      </Button>
      <Box width="full">
        <pre>{JSON.stringify(balance, null, 2)}</pre>
      </Box>
    </Stack>
  );
};
