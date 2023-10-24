import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '../common';
import { useGetClients, useGetPaymentMethods, useGetUsers } from '../../hooks';

import { SelectedUser, SelectedPayment, useBalanceContext, SelectedClient } from '.';

export const SupplierAndWarehouse = () => {
  const { data: users } = useGetUsers();
  const { data: clients } = useGetClients();
  const { data: payments } = useGetPaymentMethods();

  const [mappedUsers, setMappedUsers] = useState<SelectedUser[]>([]);
  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);
  const [mappedPayments, setMappedPayments] = useState<SelectedPayment[]>([]);

  useEffect(() => {
    if (!users || !payments || !clients) return;

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

    const mappedPayments = payments.map((el) => ({
      value: el.id,
      label: el.code,
    }));

    mappedPayments.unshift({ value: 0, label: 'TODAS' });

    setMappedPayments(mappedPayments);
  }, [clients, payments, users]);

  /* const userRef = useRef<SelectInstance<SelectedUser, false, GroupBase<SelectedUser>>>(null);

  const clientRef = useRef<SelectInstance<SelectedClient, false, GroupBase<SelectedClient>>>(null); */

  const {
    goToNext,
    user,
    setUser,
    payment,
    setPayment,
    from,
    setFrom,
    to,
    setTo,
    client,
    setClient,
  } = useBalanceContext();

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

  if (!users || !clients || !payments) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!user?.label || !client?.label || !payment?.label}
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
          Seleccione las fechas, usuario, cliente y forma de pago para obtener un informe.
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
            placeholder="Seleccionar Client"
            selectedOptionColorScheme="brand"
            tabIndex={4}
            onChange={(e) => setClient(e)}
          />
        </Box>
      </Stack>
      {/*  <Box mt={4} w="full">
        <Alert status="warning">
          <AlertIcon />
          El siguiente filtro sólo afecta a la tabla DETALLE DE MOVIMIENTOS
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="payment">Forma de Pago:</FormLabel>
          <Select
            isClearable
            isSearchable
            colorScheme="brand"
            defaultValue={payment}
            name="payment"
            options={mappedPayments}
            placeholder="Seleccionar Forma de Pago"
            selectedOptionColorScheme="brand"
            tabIndex={5}
            onChange={(e) => setPayment(e)}
          />
        </Box>
      </Stack> */}
    </Stack>
  );
};
