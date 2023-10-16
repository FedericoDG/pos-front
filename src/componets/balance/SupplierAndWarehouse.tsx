import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '../common';
import { useGetPaymentMethods, useGetUsers } from '../../hooks';

import { SelectedUser, SelectedPayment, useBalanceContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: users } = useGetUsers();
  const { data: payments } = useGetPaymentMethods();

  const [mappedUsers, setMappedUsers] = useState<SelectedUser[]>([]);
  const [mappedPayments, setMappedPayments] = useState<SelectedPayment[]>([]);

  useEffect(() => {
    if (!users || !payments) return;

    const mappedUsers = users.map((el) => ({
      value: el.id,
      label: `${el.name} ${el.lastname}`,
    }));

    mappedUsers.unshift({ value: 0, label: 'TODOS' });

    setMappedUsers(mappedUsers!);

    const mappedPayments = payments.map((el) => ({
      value: el.id,
      label: el.code,
    }));

    mappedPayments.unshift({ value: 0, label: 'TODAS' });

    setMappedPayments(mappedPayments);
  }, [payments, users]);

  const wareRef = useRef<SelectInstance<SelectedUser, false, GroupBase<SelectedUser>>>(null);

  const { goToNext, user, setUser, payment, setPayment, from, setFrom, to, setTo } =
    useBalanceContext();

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

  if (!users || !payments) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!user?.label || !payment?.label}
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
          Seleccione las fechas, usuario y forma de pago para obtener un informe.
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
            type="date"
            onChange={(e) => setTo(e.target.value)}
          />
        </Box>
      </Stack>
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="user">Usuario:</FormLabel>
          <Select
            ref={wareRef}
            isClearable
            isSearchable
            colorScheme="brand"
            defaultValue={user}
            name="user"
            options={mappedUsers}
            placeholder="Seleccionar Usuario"
            selectedOptionColorScheme="brand"
            tabIndex={2}
            onChange={(e) => setUser(e)}
          />
        </Box>
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
            tabIndex={2}
            onChange={(e) => setPayment(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
