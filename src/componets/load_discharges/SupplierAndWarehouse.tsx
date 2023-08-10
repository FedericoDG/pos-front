import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { Loading } from '../common';
import { useGetWarehousesWOStock } from '../../hooks';

import { SelectedWarehouse, useDischargesContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: warehouses } = useGetWarehousesWOStock();

  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = warehouses
      .filter((el) => el.driver !== 1)
      .map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedWarehouses(mappedWarehouses);
  }, [warehouses]);

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  const { goToNext, warehouse, setWarehouse } = useDischargesContext();

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

  if (!warehouses) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!warehouse?.value}
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
          Seleccione el Depósito del cual se descartarán productos.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="50%">
          <FormLabel htmlFor="warehouse">Depósito:</FormLabel>
          <Select
            ref={wareRef}
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            name="warehouse"
            options={mappedWarehouses}
            placeholder="Seleccionar Depósito"
            selectedOptionColorScheme="brand"
            tabIndex={2}
            onChange={(e) => setWarehouse(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
