import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { GroupBase, Select, SelectInstance } from 'chakra-react-select';
import { useEffect, useRef, useState } from 'react';

import { useGetProductsWOStock, useGetWarehousesWOStock, useGetSuppliers } from '../../hooks';
import { Loading } from '../common';

import { SelectedSupplier, SelectedWarehouse, usePurchasesContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: products } = useGetProductsWOStock();
  const { data: warehouses } = useGetWarehousesWOStock();
  const { data: suppliers } = useGetSuppliers();

  const [mappedSuppliers, setMappedSuppliers] = useState<SelectedSupplier[]>([]);
  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);

  useEffect(() => {
    if (!suppliers || !warehouses) return;

    const mappedSuppliers = suppliers.map((el) => ({
      ...el,
      value: el.id,
      label: `${el.cuit} - ${el.name}`,
    }));
    const mappedWarehouses = warehouses.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedSuppliers(mappedSuppliers);
    setMappedWarehouses(mappedWarehouses);
  }, [products, suppliers, warehouses]);

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  const { goToNext, supplier, warehouse, setSupplier, setWarehouse } = usePurchasesContext();

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

  if (!products || !suppliers || !warehouses) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!supplier?.value || !warehouse?.value}
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
          Seleccione el Proveedor y el Depósito de destino de la compra.
        </Alert>
      </Box>
      <Stack direction="row">
        <Box w="full">
          <FormLabel htmlFor="warehouse">Proveedor:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            name="supplier"
            options={mappedSuppliers}
            placeholder="Seleccionar Proveedor"
            selectedOptionColorScheme="brand"
            tabIndex={1}
            onChange={(e) => setSupplier(e)}
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
            isDisabled={!supplier?.value}
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
