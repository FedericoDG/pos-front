import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Stack,
  Alert,
  AlertIcon,
  FormLabel,
  Button,
  FormControl,
  Switch,
} from '@chakra-ui/react';
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

  const [enabledFilter, setEnabledFilter] = useState<boolean>(true);

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = warehouses
      .map((el) => ({ ...el, value: el.id, label: el.code }))
      .filter((el) => el.driver !== 1);

    setMappedWarehouses(mappedWarehouses);
  }, [warehouses]);

  useEffect(() => {
    if (!warehouses || !mappedWarehouses) return;

    if (enabledFilter) {
      const mappedWarehouses2 = warehouses
        .map((el) => ({ ...el, value: el.id, label: el.code }))
        .filter((el) => el.id !== warehouse?.id && el.driver === 1);

      setMappedWarehouses2(mappedWarehouses2);
    } else {
      const mappedWarehouses2 = warehouses
        .map((el) => ({ ...el, value: el.id, label: el.code }))
        .filter((el) => el.id !== warehouse?.id && el.driver !== 1);

      setMappedWarehouses2(mappedWarehouses2);
    }
  }, [enabledFilter, mappedWarehouses, warehouse?.id, warehouses]);

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
          {enabledFilter
            ? 'Seleccione el Depósito de Origen y el Chofer de Destino.'
            : 'Seleccione los Depósitos de Origen y Destino.'}
        </Alert>
      </Box>
      {/* <FormControl alignItems="center" display="flex" my="2">
        <Switch
          colorScheme="brand"
          defaultChecked={enabledFilter}
          id="drivers"
          onChange={(e) => setEnabledFilter(e.target.checked)}
        />
        <FormLabel htmlFor="drivers" mb="0" ml="2">
          Choferes
        </FormLabel>
      </FormControl> */}
      <Stack direction="row">
        <Box w="full">
          <FormLabel htmlFor="warehouse">Depósito de Origen:</FormLabel>
          <Select
            ref={wareRef}
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!!warehouse2?.id}
            name="warehouse"
            options={mappedWarehouses}
            placeholder="Seleccionar Depósito"
            selectedOptionColorScheme="brand"
            tabIndex={2}
            onChange={(e) => setWarehouse(e)}
          />
        </Box>
        <Box w="full">
          <FormLabel htmlFor="warehouse">
            {enabledFilter ? 'Chofer de Destino' : 'Depósito de Destino'}:
          </FormLabel>
          <Select
            ref={wareRef}
            isClearable
            isSearchable
            colorScheme="brand"
            isDisabled={!warehouse?.id}
            name="warehouse"
            options={mappedWarehouses2}
            placeholder={enabledFilter ? 'Seleccionar Chofer' : 'Seleccionar Depósito'}
            selectedOptionColorScheme="brand"
            tabIndex={2}
            onChange={(e) => setWarehouse2(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
