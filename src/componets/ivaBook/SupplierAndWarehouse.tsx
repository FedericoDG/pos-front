import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button, Input } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Select } from 'chakra-react-select';

import { useGetInvoceTypes } from '../../hooks';
import { Loading } from '../common';

import { SelectedInvoice, useBalanceContext } from '.';

export const SupplierAndWarehouse = () => {
  const { goToNext, from, setFrom, to, setTo, invoices, setInvoices } = useBalanceContext();

  const { data: invoiceList } = useGetInvoceTypes();

  const [mappedInvoices, setMappedInvoices] = useState<SelectedInvoice[]>([]);

  useEffect(() => {
    if (!invoiceList) return;

    const mappedInvoices = invoiceList
      .filter((el) => el.code === '001' || el.code === '006' || el.code === '051')
      .map((el) => ({
        value: el.id,
        label: el.description,
      }));

    setMappedInvoices(mappedInvoices);
    if (invoices.length === 0) setInvoices(mappedInvoices);
  }, [invoiceList, invoices.length, setInvoices]);

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

  if (!invoiceList) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
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
