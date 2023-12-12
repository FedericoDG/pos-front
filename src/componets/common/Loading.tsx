import { Heading, Stack } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Stack align="center" justifyContent="center" minH="70vh">
      <div className="loader" />
      <Heading color="brand.200" size="lg">
        CARGANDO
      </Heading>
    </Stack>
  );
};
