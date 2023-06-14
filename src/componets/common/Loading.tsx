import { Heading, Stack } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Stack align="center" justifyContent="center" minH="70vh">
      <Heading color="brand.200">CARGANDO...</Heading>
    </Stack>
  );
};
