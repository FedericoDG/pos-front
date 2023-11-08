import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { useEffect } from 'react';

import { useBalanceContext } from '.';

export const SupplierAndWarehouse = () => {
  const { goToNext, from, setFrom, to, setTo } = useBalanceContext();

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
          //isDisabled={!user?.label || !client?.label || invoices.length < 1}
          minW="150px"
          ml="auto"
          rightIcon={<ArrowForwardIcon />}
          size="lg"
          tabIndex={6}
          onClick={() => goToNext()}
        >
          SIGUIENTE
        </Button>
      </Stack>
      <Box w="full">
        <Alert status="info">
          <AlertIcon />
          Seleccione las fechas, usuario, cliente y tipo de comprobante para obtener un informe.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="from">Inicio:</FormLabel>
          <Input
            autoFocus
            defaultValue={from}
            name="from"
            placeholder="Selecciona una fecha"
            size="md"
            tabIndex={1}
            type="date"
            onChange={(e) => setFrom(e.target.value)}
          />
        </Box>
        <Box w="50%">
          <FormLabel htmlFor="to">Final:</FormLabel>
          <Input
            defaultValue={to}
            name="to"
            placeholder="Selecciona una fecha"
            size="md"
            tabIndex={2}
            type="date"
            onChange={(e) => setTo(e.target.value)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
