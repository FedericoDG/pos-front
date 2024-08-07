import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useEffect, useState } from 'react';

import { Loading } from '../common';
import { useGetClients } from '../../hooks';

import { useCurrentAccountContext, SelectedClient } from '.';

export const SupplierAndWarehouse = () => {
  const { goToNext, from, setFrom, to, setTo, client, setClient } = useCurrentAccountContext();

  const { data: clients } = useGetClients();

  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);

  useEffect(() => {
    if (!clients) return;

    const mappedClients = clients
      .filter((el) => el.document !== '00000000')
      .map((el) => ({
        value: el.id,
        label: el.name,
      }));

    setMappedClients(mappedClients!);
  }, [clients]);

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

  if (!clients) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!client?.label}
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
          Seleccione las fechas y cliente para obtener un informe.
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
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="client">Cliente:</FormLabel>
          <Select
            isClearable
            isSearchable
            colorScheme="brand"
            defaultValue={client}
            name="client"
            options={mappedClients}
            placeholder="Seleccionar Cliente"
            selectedOptionColorScheme="brand"
            tabIndex={4}
            onChange={(e) => setClient(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
