import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { useEffect } from 'react';

import { usePurchasesContext } from '.';

export const TransportAndDriver = () => {
  const { goToNext, setTransport, setDriver } = usePurchasesContext();

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return goToNext();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [goToNext]);

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          minW="150px"
          ml="auto"
          rightIcon={<ArrowForwardIcon />}
          size="lg"
          tabIndex={3}
          onClick={() => goToNext()}
        >
          SIGUIENTE
        </Button>
      </Stack>
      <Box w="full">
        <Alert status="info">
          <AlertIcon />
          Ingrese la información sobre el Transporte y Chofer
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="full">
          <FormLabel htmlFor="transport">Transporte:</FormLabel>
          <Input
            autoFocus
            colorScheme="brand"
            name="transport"
            placeholder="Datos del transporte"
            tabIndex={1}
            onChange={(e) => setTransport(e.target.value)}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="driver">Chofer:</FormLabel>
          <Input
            colorScheme="brand"
            name="driver"
            placeholder="Datos del chofer"
            tabIndex={2}
            onChange={(e) => setDriver(e.target.value)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
