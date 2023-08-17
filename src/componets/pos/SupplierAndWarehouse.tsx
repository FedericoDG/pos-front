import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { useGetWarehousesWOStock, useGetClients, useGetPriceLists } from '../../hooks';
import { Loading } from '../common';
import { useMyContext } from '../../context';

import { SelectedClient, SelectedPriceList, SelectedWarehouse, usePosContext } from '.';

export const SupplierAndWarehouse = () => {
  const { user } = useMyContext();
  const { data: warehouses } = useGetWarehousesWOStock();
  const { data: clients } = useGetClients();
  const { data: priceLists } = useGetPriceLists();

  const [mappedPriceLists, setMappedPriceLists] = useState<SelectedPriceList[]>([]);
  const [mappedClients, setMappedClients] = useState<SelectedClient[]>([]);
  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);

  const { goToNext, client, warehouse, setClient, setWarehouse, priceList, setPriceList } =
    usePosContext();

  useEffect(() => {
    if (!priceLists || !clients || !warehouses) return;

    const mappedClients = clients.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.document} - ${el.name} ${el.lastname}`,
    }));

    setMappedClients(mappedClients);

    const mappedPriceLists = priceLists.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedPriceLists(mappedPriceLists);

    if (user.roleId === 4) {
      const mappedWarehouses = warehouses
        .filter((el) => el.driver === 1)
        .map((el) => ({ ...el, value: el.id, label: el.code }));

      setMappedWarehouses(mappedWarehouses);
    } else {
      const mappedWarehouses = warehouses
        .filter((el) => el.driver === 0)
        .map((el) => ({ ...el, value: el.id, label: el.code }));

      setMappedWarehouses(mappedWarehouses);
    }
  }, [clients, priceLists, user.roleId, warehouses]);

  useEffect(() => {
    if (mappedPriceLists.length < 1 || mappedClients.length < 1 || mappedWarehouses.length < 1)
      return;

    setClient(mappedClients.find((el) => el.id === user.userPreferences?.clientId)!);
    setPriceList(mappedPriceLists.find((el) => el.id === user.userPreferences?.priceListId)!);

    if (user.roleId === 4) {
      setWarehouse(mappedWarehouses.find((el) => el.user?.id === user.id)!);
    } else {
      setWarehouse(mappedWarehouses.find((el) => el.id === user.userPreferences?.warehouseId)!);
    }
  }, [
    mappedClients,
    mappedClients.length,
    mappedPriceLists,
    mappedPriceLists.length,
    mappedWarehouses,
    mappedWarehouses.length,
    setClient,
    setPriceList,
    setWarehouse,
    user.id,
    user.roleId,
    user.userPreferences?.clientId,
    user.userPreferences?.priceListId,
    user.userPreferences?.warehouseId,
    warehouses,
  ]);

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  const clientRef = useRef<SelectInstance<SelectedClient, false, GroupBase<SelectedClient>>>(null);

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

  if (!clients || !warehouses || !priceLists) return <Loading />;

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
          tabIndex={4}
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
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        <Box w="49%">
          <FormLabel htmlFor="priceList">Lista de Precio:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            id="priceList"
            options={mappedPriceLists}
            placeholder="Seleccionar Lista de Precio"
            selectedOptionColorScheme="brand"
            tabIndex={1}
            value={priceList}
            onChange={(e) => setPriceList(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') wareRef.current?.focus();
            }}
          />
        </Box>
        {user.id !== 4 && (
          <Box w="49%">
            <FormLabel htmlFor="warehouse">Depósito:</FormLabel>
            <Select
              ref={wareRef}
              isClearable
              isSearchable
              colorScheme="brand"
              id="warehouse"
              isDisabled={!priceList?.value}
              options={mappedWarehouses}
              placeholder="Seleccionar Depósito"
              selectedOptionColorScheme="brand"
              tabIndex={2}
              value={warehouse}
              onChange={(e) => setWarehouse(e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') clientRef.current?.focus();
              }}
            />
          </Box>
        )}
        <Box w="49%">
          <FormLabel htmlFor="client">Cliente:</FormLabel>
          <Select
            ref={clientRef}
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            id="client"
            isDisabled={!priceList?.value || !warehouse?.value}
            options={mappedClients}
            placeholder="Seleccionar Cliente"
            selectedOptionColorScheme="brand"
            tabIndex={3}
            value={client}
            onChange={(e) => setClient(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
