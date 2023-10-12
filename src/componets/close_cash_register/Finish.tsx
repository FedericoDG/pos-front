import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, FormLabel, Button } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { useCloseCashRegisterById, useGetWarehousesWOStock } from '../../hooks';
import { Loading } from '../common';

import { SelectedWarehouse, useDischargesContext } from '.';

export const Finish = () => {
  const { emptyCart, cart, setActiveStep, setWarehouse, warehouse } = useDischargesContext();

  const [mappedWarehouses, setMappedWarehouses] = useState<SelectedWarehouse[]>([]);
  const [warehouseDestinationId, setWarehouseDestinationId] = useState<number>(0);

  const { data: warehouses } = useGetWarehousesWOStock();

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (!warehouses) return;

    const mappedWarehouses = warehouses.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedWarehouses(mappedWarehouses);
  }, [warehouses]);

  //
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Caja Cerrada');
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setWarehouse(null);
    setActiveStep(1);
    navigate('/panel/caja');
  };

  const { mutate } = useCloseCashRegisterById(onSuccess);

  const handleSubmit = useCallback(() => {
    const discharge = {
      userId: Number(id),
      warehouseId: warehouse?.id!,
      cart: cart.map((item) => ({
        productId: item.productId,
        reasonId: item.reasonId,
        quantity: item.quantity,
        cost: item.cost,
        info: item.info,
      })),
      warehouseDestinationId,
      closingDate: new Date(),
    };

    mutate(discharge);
  }, [cart, id, mutate, warehouse?.id, warehouseDestinationId]);

  const onReset = () => {
    emptyCart();
    setWarehouse(null);
    setActiveStep(1);
    navigate('/panel/caja');
  };

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return handleSubmit();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleSubmit]);

  if (!warehouses) return <Loading />;

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <Box w="50%">
        <FormLabel htmlFor="warehouse">Depósito de Destino:</FormLabel>
        <Select
          autoFocus
          isClearable
          isSearchable
          colorScheme="brand"
          name="warehouse"
          options={mappedWarehouses.filter((el) => el.driver !== 1)}
          placeholder="Seleccionar Depósito"
          selectedOptionColorScheme="brand"
          tabIndex={2}
          onChange={(e) => setWarehouseDestinationId(e?.id!)}
        />
      </Box>
      <Stack direction="row" mt="8">
        <Button mr={3} type="reset" variant="outline" w="full" onClick={onReset}>
          CANCELAR
        </Button>
        <Button
          colorScheme="brand"
          isDisabled={warehouseDestinationId < 1}
          variant="solid"
          w="full"
          onClick={handleSubmit}
        >
          CERRRAR CAJA
        </Button>
      </Stack>
    </Stack>
  );
};
