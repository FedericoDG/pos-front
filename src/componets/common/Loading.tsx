import { Heading, Stack } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Stack align="center" justifyContent="center" minH="75vh">
      <Heading color="gray.200">CARGANDO...</Heading>
    </Stack>
  );
};
