import { Box, Stack, FormLabel, Text, AlertIcon, Alert, Input } from '@chakra-ui/react';
import { Select, SelectInstance, GroupBase } from 'chakra-react-select';
import { useRef } from 'react';

import { SelectedSupplier, SelectedWarehouse, usePurchaseContext } from '.';

interface Props {
  mappedSuppliers: SelectedSupplier[];
  mappedWarehouses: SelectedWarehouse[];
}

export const SelectSupplierAndWarehouse = ({ mappedSuppliers, mappedWarehouses }: Props) => {
  const {
    supplier,
    setSupplier,
    warehouse,
    setWarehouse,
    setDriver,
    setTransport,
    driver,
    transport,
  } = usePurchaseContext();

  const wareRef =
    useRef<SelectInstance<SelectedWarehouse, false, GroupBase<SelectedWarehouse>>>(null);

  //if (!supplier || !warehouse) return null;

  return (
    <>
      {supplier?.value && warehouse?.value && driver && transport ? (
        <Stack bg="white" mb="4" p="4" rounded="md" w="full">
          <Stack direction="row">
            <Stack alignItems="flex-start" direction="row" justifyContent="space-between" w="full">
              <Stack
                bg="gray.700"
                color="whitesmoke"
                fontSize="lg"
                lineHeight="1"
                p="2"
                rounded="md"
                w="420px"
              >
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">CUIT:</Text>
                  <Text>{supplier.cuit}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">NOMBRE:</Text>
                  <Text>{supplier.name}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">TELÉFONO:</Text>
                  <Text>{supplier.phone}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">CELULAR:</Text>
                  <Text>{supplier.mobile}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">EMAIL:</Text>
                  <Text>{supplier.email}</Text>
                </Stack>
              </Stack>
              <Stack
                bg="gray.700"
                color="whitesmoke"
                fontSize="lg"
                lineHeight="1"
                p="2"
                rounded="md"
                w="420px"
              >
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">DEPÓSITO:</Text>
                  <Text>{warehouse.code}</Text>
                </Stack>
                <Stack direction="row" justifyContent="space-between" w="full">
                  <Text fontWeight="semibold">DESCRIPCIÓN:</Text>
                  <Text>{warehouse.description}</Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Text>Transporte: {transport}</Text>
          <Text>Chofer: {driver}</Text>
        </Stack>
      ) : (
        <>
          <Stack bg="white" mb="4" p="4" rounded="md" w="full">
            <Box w="full">
              <Alert status="info">
                <AlertIcon />
                Seleccione el Proveedor y el Depósito de destino de la compra
              </Alert>
            </Box>
            <Stack direction="row">
              <Box w="full">
                <FormLabel htmlFor="transport">Transporte:</FormLabel>
                <Input
                  autoFocus
                  colorScheme="brand"
                  name="transport"
                  placeholder="Datos del transporte"
                  onChange={(e) => setTransport(e.target.value)}
                />
              </Box>
              <Box w="full">
                <FormLabel htmlFor="driver">Chofer:</FormLabel>
                <Input
                  colorScheme="brand"
                  name="driver"
                  placeholder="Datos del chofer"
                  onChange={(e) => setDriver(e.target.value)}
                />
              </Box>
            </Stack>
            <Stack direction="row">
              <Box w="full">
                <FormLabel htmlFor="warehouse">Proveedor:</FormLabel>
                <Select
                  isClearable
                  isSearchable
                  colorScheme="brand"
                  name="supplier"
                  options={mappedSuppliers}
                  placeholder="Seleccionar Proveedor"
                  selectedOptionColorScheme="brand"
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
                  onChange={(e) => setWarehouse(e)}
                />
              </Box>
            </Stack>
          </Stack>
        </>
      )}
    </>
  );
};
