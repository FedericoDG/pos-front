import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '../common';
import { useGetWarehousesWOStock } from '../../hooks';

import { SelectedWarehouse, useProductTransContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: warehouses } = useGetWarehousesWOStock();

  const { goToNext, warehouse, warehouse2, setWarehouse, setWarehouse2 } = useProductTransContext();

  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);
  const [mappedWarehouses2, setMappedWarehouses2] = useState<SelectedWarehouse[]>([]);

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = warehouses.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedWarehouses(mappedWarehouses);
  }, [warehouses]);

  useEffect(() => {
    if (!warehouses || !mappedWarehouses) return;

    const mappedWarehouses2 = warehouses
      .map((el) => ({ ...el, value: el.id, label: el.code }))
      .filter((el) => el.id !== warehouse?.id);

    setMappedWarehouses2(mappedWarehouses2);
  }, [mappedWarehouses, warehouse?.id, warehouses]);

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  if (!warehouses) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!warehouse?.value || !warehouse2?.value}
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
          Seleccione los Depósitos de Origen y Destino.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="full">
          <FormLabel htmlFor="warehouse">Depósito de Origen:</FormLabel>
          <Select
            ref={wareRef}
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!!warehouse2?.id}
            name="warehouse"
            options={mappedWarehouses}
            placeholder="Seleccionar Depósito"
            tabIndex={2}
            onChange={(e) => setWarehouse(e)}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="warehouse">Depósito de Destino:</FormLabel>
          <Select
            ref={wareRef}
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!warehouse?.id}
            name="warehouse"
            options={mappedWarehouses2}
            placeholder="Seleccionar Depósito"
            tabIndex={2}
            onChange={(e) => setWarehouse2(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
