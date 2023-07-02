import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { useGetWarehousesWOStock, useGetClients, useGetPriceLists } from '../../hooks';
import { Loading } from '../common';

import { SelectedClient, SelectedPriceList, SelectedWarehouse, usePosContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: warehouses } = useGetWarehousesWOStock();
  const { data: clients } = useGetClients();
  const { data: priceLists } = useGetPriceLists();

  const [mappedPriceLists, setMappedPriceLists] = useState<SelectedPriceList[]>([]);
  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);
  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);

  useEffect(() => {
    if (!priceLists || !clients || !warehouses) return;

    const mappedClients = clients.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.document} - ${el.name} ${el.lastname}`,
    }));

    const mappedPriceLists = priceLists.map((el) => ({ ...el, value: el.id, label: el.code }));

    const mappedWarehouses = warehouses.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedPriceLists(mappedPriceLists);
    setMappedClients(mappedClients);
    setMappedWarehouses(mappedWarehouses);
  }, [clients, warehouses, priceLists]);

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  const clientRef = useRef<SelectInstance<SelectedClient, false, GroupBase<SelectedClient>>>(null);

  const { goToNext, client, warehouse, setClient, setWarehouse, priceList, setPriceList } =
    usePosContext();

  if (!clients || !warehouses) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!client?.value || !warehouse?.value}
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
          Seleccione la Lista de Precio, el Depósito y el Cliente.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="full">
          <FormLabel htmlFor="warehouse">Lista de Precio:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            name="supplier"
            options={mappedPriceLists}
            placeholder="Seleccionar Lista de Precio"
            selectedOptionColorScheme="brand"
            tabIndex={1}
            onChange={(e) => setPriceList(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') wareRef.current?.focus();
            }}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="warehouse">Depósito:</FormLabel>
          <Select
            ref={wareRef}
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!priceList?.value}
            name="warehouse"
            options={mappedWarehouses}
            placeholder="Seleccionar Depósito"
            tabIndex={2}
            onChange={(e) => setWarehouse(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') clientRef.current?.focus();
            }}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="warehouse">Cliente:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!priceList?.value || !warehouse?.value}
            name="client"
            options={mappedClients}
            placeholder="Seleccionar Cliente"
            selectedOptionColorScheme="brand"
            tabIndex={1}
            onChange={(e) => setClient(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
