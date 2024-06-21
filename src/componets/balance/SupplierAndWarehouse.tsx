import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useEffect, useState } from 'react';

import { Loading } from '../common';
import { useGetClients, useGetInvoceTypes, useGetSettings, useGetUsers } from '../../hooks';

import { SelectedUser, useBalanceContext, SelectedClient, SelectedInvoice } from '.';

export const SupplierAndWarehouse = () => {
  const {
    goToNext,
    user,
    setUser,
    from,
    setFrom,
    to,
    setTo,
    client,
    setClient,
    invoices,
    setInvoices,
  } = useBalanceContext();

  const { data: users } = useGetUsers();
  const { data: clients } = useGetClients();
  const { data: invoiceList } = useGetInvoceTypes();
  const { data: settings } = useGetSettings(1);

  const [mappedUsers, setMappedUsers] = useState<SelectedUser[]>([]);
  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);
  const [mappedInvoices, setMappedInvoices] = useState<SelectedInvoice[]>([]);

  useEffect(() => {
    if (!users || !clients || !invoiceList || !settings) return;

    const mappedUsers = users.map((el) => ({
      value: el.id,
      label: `${el.name} ${el.lastname}`,
    }));

    mappedUsers.unshift({ value: 0, label: 'TODOS' });

    setMappedUsers(mappedUsers!);

    const mappedClients = clients.map((el) => ({
      value: el.id,
      label: el.name,
    }));

    mappedClients.unshift({ value: 0, label: 'TODOS' });

    setMappedClients(mappedClients!);
  }, [users, clients, invoiceList, settings]);

  useEffect(() => {
    if (!users || !clients || !invoiceList || !settings) return;

    let mappedInvoices;

    if (settings.responsableInscripto === 0) {
      mappedInvoices = invoiceList
        .filter(
          (el) => el.code === '001' || el.code === '006' || el.code === '051' || el.code === '555'
        )
        .map((el) => ({
          value: el.id,
          label: el.description,
        }));
    } else {
      mappedInvoices = invoiceList
        .filter((el) => el.code === '011' || el.code === '555')
        .map((el) => ({
          value: el.id,
          label: el.description,
        }));
    }

    setMappedInvoices(mappedInvoices);

    if (invoices.length === 0) setInvoices(mappedInvoices);
  }, [clients, invoiceList, invoices.length, setInvoices, settings, users]);

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

  if (!users || !clients || !invoiceList || !settings) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!user?.label || !client?.label || invoices.length < 1}
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
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="user">Usuario:</FormLabel>
          <Select
            isClearable
            isSearchable
            colorScheme="brand"
            defaultValue={user}
            name="user"
            options={mappedUsers}
            placeholder="Seleccionar Usuario"
            selectedOptionColorScheme="brand"
            tabIndex={3}
            onChange={(e) => setUser(e)}
          />
        </Box>
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
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="client">Tipo de Comprobante:</FormLabel>
          <Select
            isClearable
            isMulti
            isSearchable
            colorScheme="gray"
            name="invoices"
            noOptionsMessage={() => 'No hay más opciones'}
            options={mappedInvoices}
            placeholder="Seleccionar Comprobantes"
            selectedOptionColorScheme="brand"
            tabIndex={4}
            value={invoices}
            onChange={(e) => setInvoices([...e])}
          />
        </Box>
        <Box w="50%" />
      </Stack>
    </Stack>
  );
};
